const ERROR = new Error('error message');

function pick(config, key, defaultValue) {
  if (Object.prototype.hasOwnProperty.call(config, key)) {
    return config[key];
  }
  return defaultValue;
}

function init(config) {
  const defaults = {
    order: [1, 2, 3],
    calls1: [10, 20],
    calls2: [10, 20],
    calls3: [10, 20],
  };

  if (config.value2 instanceof Error || typeof config.value2 === 'string') {
    defaults.order = [1, 2];
    defaults.calls3 = [];
  }

  return {
    ...defaults,
    ...config,
  };
}

function flat(arr) {
  return arr.reduce((result, item) => result.concat(item), []);
}

function asset(actual, expected) {
  if (!expected.error) {
    expect(actual.return).toEqual(expected.return);
  } else if (actual.error) {
    if (typeof actual.error === 'string') {
      expect(actual.error).toEqual(ERROR.message);
    } else {
      expect(actual.error.name).toEqual(ERROR.name);
      expect(actual.error.message).toEqual(ERROR.message);
    }
  } else {
    console.log('actual', actual.error, actual.return);
    throw new Error('unexpected call result');
  }

  expect(actual.order).toEqual(expected.order);

  expect(actual.calls1).toEqual(expected.calls1);
  expect(actual.calls2).toEqual(expected.calls2);
  expect(actual.calls3).toEqual(expected.calls3);

  if (expected.cost) {
    expect(actual.cost).toEqual(expected.cost);
  }
}

exports.testCallEmptySyncHooks = (Hook, expected) => {
  const hook = new Hook(['a', 'b']);
  expect(hook.call(10, 20)).toEqual(expected);
};

exports.testCallEmptyAsyncHooks = async (Hook, expected) => {
  const hook = new Hook(['a', 'b']);
  expect(await hook.promise(10, 20)).toEqual(expected);
};

exports.testCallSyncHooks = (Hook, config = {}) => {
  let index = 0;
  const order = [];
  const factory = (value) => {
    const factoryIndex = ++index;
    return (...args) => {
      order.push(factoryIndex);
      if (value instanceof Error) {
        throw value;
      } else if (typeof value === 'string') {
        throw new Error(value);
      } else if (typeof value === 'function') {
        return value(...args);
      } else {
        return value;
      }
    };
  };
  const mock1 = jest.fn(factory(pick(config, 'value1', 1)));
  const mock2 = jest.fn(factory(pick(config, 'value2', 2)));
  const mock3 = jest.fn(factory(pick(config, 'value3', 3)));
  const hook = new Hook(['a', 'b']);
  hook.tap('A', mock1);
  hook.tap('B', mock2);
  hook.tap('C', mock3);
  let result;
  let error;
  try {
    const args = config.args || [10, 20];
    result = hook.call(...args);
  } catch (err) {
    error = err;
  }
  const actual = {
    return: result,
    error,
    order,
    calls1: flat(mock1.mock.calls),
    calls2: flat(mock2.mock.calls),
    calls3: flat(mock3.mock.calls),
  };
  const expected = init(config);
  asset(actual, expected);
};

exports.testCallAsyncHooks = async (Hook, config = {}) => {
  let cost = 0;
  let running = 0;
  let index = 0;
  const order = [];
  const factory = (value, timestamp) => {
    const factoryIndex = ++index;
    return (...args) => {
      running++;
      order.push(factoryIndex);
      return new Promise((resolve) => {
        setTimeout(() => resolve(0), timestamp);
      }).then(() => {
        running--;
        if (!running) cost += timestamp * 100;
        if (value instanceof Error) {
          throw value;
        } else if (typeof value === 'string') {
          return Promise.reject(value);
        } else if (typeof value === 'function') {
          return value(...args);
        } else {
          return value;
        }
      });
    };
  };

  const mock1 = jest.fn(factory(pick(config, 'value1', 1), 40));
  const mock2 = jest.fn(factory(pick(config, 'value2', 2), 20));
  const mock3 = jest.fn(factory(pick(config, 'value3', 3), 10));
  const hook = new Hook(['a', 'b']);
  hook.tapPromise('A', mock1);
  hook.tapPromise('B', mock2);
  hook.tapPromise('C', mock3);
  let result;
  let error;
  try {
    const args = config.args || [10, 20];
    result = await hook.promise(...args);
  } catch (err) {
    error = err;
  }
  const actual = {
    return: result,
    error,
    order,
    calls1: flat(mock1.mock.calls),
    calls2: flat(mock2.mock.calls),
    calls3: flat(mock3.mock.calls),
    cost,
  };
  const expected = init(config);
  asset(actual, expected);
};
