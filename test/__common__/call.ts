import { AsyncHookConstructor, HookConstructor } from './type';
import HookError from 'tapcall/util/hook-error';
import * as console from 'console';

type Numeric = number | undefined;

type Value = Numeric | ((...args: number[]) => Numeric) | string | Error;

type RESULT =
  | {
      error: true;
    }
  | {
      error?: false;
      return?: number;
    };

type Expected = {
  order: number[];
  calls1: Numeric[];
  calls2: Numeric[];
  calls3: Numeric[];
  cost?: number;
} & RESULT;

type Config = {
  args?: number[];
  value1?: Value;
  value2?: Value;
  value3?: Value;
} & RESULT &
  Partial<Omit<Expected, 'error' | 'return'>>;

const ERROR = new HookError('error message', {
  type: 'call',
  hook: 'hook',
  receiver: 'B',
});

function pick<T extends keyof Config>(
  config: Config,
  key: T,
  defaultValue: Config[T],
) {
  if (Object.prototype.hasOwnProperty.call(config, key)) {
    return config[key];
  }
  return defaultValue;
}

function init(config: Config): Expected {
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

function flat<T>(arr: T[][]) {
  return arr.reduce((result, item) => result.concat(item), []);
}

function asset(
  actual: Omit<Expected, 'error' | 'return'> & {
    return?: Numeric;
    error?: HookError;
  },
  expected: Expected,
) {
  if (!expected.error) {
    expect(actual.return).toEqual(expected.return);
  } else if (actual.error) {
    expect(actual.error.name).toEqual(ERROR.name);
    expect(actual.error.message).toEqual(ERROR.message);
    expect(actual.error.type).toEqual(ERROR.type);
    expect(actual.error.hook).toEqual(ERROR.hook);
    expect(actual.error.receiver).toEqual(ERROR.receiver);
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

export const testCallEmptySyncHooks = (
  Hook: HookConstructor,
  expected?: Value,
) => {
  const hook = new Hook('hook');
  expect(hook.call(10, 20)).toEqual(expected);
};

export const testCallEmptyAsyncHooks = async (
  Hook: AsyncHookConstructor,
  expected?: Value,
) => {
  const hook = new Hook('hook');
  expect(await hook.call(10, 20)).toEqual(expected);
};

export const testCallSyncHooks = (
  Hook: HookConstructor,
  config: Config = {},
) => {
  let index = 0;
  const order: number[] = [];
  const factory = (value: Value) => {
    const factoryIndex = ++index;
    return (...args: unknown[]) => {
      order.push(factoryIndex);
      if (value instanceof Error) {
        throw value;
      } else if (typeof value === 'string') {
        throw new Error(value);
      } else if (typeof value === 'function') {
        return value(...(args as number[]));
      } else {
        return value;
      }
    };
  };
  const mock1 = jest.fn(factory(pick(config, 'value1', 1)));
  const mock2 = jest.fn(factory(pick(config, 'value2', 2)));
  const mock3 = jest.fn(factory(pick(config, 'value3', 3)));
  const hook = new Hook('hook');
  hook.tap('A', mock1);
  hook.tap('B', mock2);
  hook.tap('C', mock3);
  let result;
  let error;
  try {
    const args = config.args || [10, 20];
    result = hook.call(...args) as Numeric;
  } catch (err) {
    error = err as HookError;
  }
  const actual = {
    return: result,
    error,
    order,
    calls1: flat(mock1.mock.calls) as Numeric[],
    calls2: flat(mock2.mock.calls) as Numeric[],
    calls3: flat(mock3.mock.calls) as Numeric[],
  };
  const expected = init(config);
  asset(actual, expected);
};

export const testCallAsyncHooks = async (
  Hook: AsyncHookConstructor,
  config: Config = {},
) => {
  let cost = 0;
  let running = 0;
  let index = 0;
  const order: number[] = [];
  const factory = (value: Value, timestamp: number) => {
    const factoryIndex = ++index;
    return (...args: unknown[]) => {
      running++;
      order.push(factoryIndex);
      return new Promise<Numeric>((resolve) => {
        setTimeout(() => resolve(0), timestamp);
      }).then(() => {
        running--;
        if (!running) cost += timestamp * 10;
        if (value instanceof Error) {
          throw value;
        } else if (typeof value === 'string') {
          return Promise.reject(value);
        } else if (typeof value === 'function') {
          return value(...(args as number[]));
        } else {
          return value;
        }
      });
    };
  };

  const mock1 = jest.fn(factory(pick(config, 'value1', 1), 40));
  const mock2 = jest.fn(factory(pick(config, 'value2', 2), 20));
  const mock3 = jest.fn(factory(pick(config, 'value3', 3), 10));
  const hook = new Hook('hook');
  hook.tap('A', mock1);
  hook.tap('B', mock2);
  hook.tap('C', mock3);
  let result;
  let error;
  try {
    const args = config.args || [10, 20];
    result = (await hook.call(...args)) as Numeric;
  } catch (err) {
    error = err as HookError;
  }
  const actual = {
    return: result,
    error,
    order,
    calls1: flat(mock1.mock.calls) as Numeric[],
    calls2: flat(mock2.mock.calls) as Numeric[],
    calls3: flat(mock3.mock.calls) as Numeric[],
    cost,
  };
  const expected = init(config);
  asset(actual, expected);
};
