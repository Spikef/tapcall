import { AsyncHookConstructor, HookConstructor } from './type';
import HookError from 'tapcall/util/hook-error';

type Value = number | undefined | string | Error;
type Config = {
  calls1?: (number | undefined)[];
  calls2?: (number | undefined)[];
  calls3?: (number | undefined)[];
  value1?: Value;
  value2?: Value;
  value3?: Value;
} & (
  | {
      error: true;
    }
  | {
      error?: false;
      return?: number | undefined;
    }
);
type AsyncConfig = Config & {
  cost?: `${'>' | '<'}${number}`;
};

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

function first<T>(arr: T[][]) {
  return arr.map((item) => item[0]);
}

function asset(
  actual: {
    return?: unknown;
    error?: HookError;
    order: number[];
    mock1: jest.Mock;
    mock2: jest.Mock;
    mock3: jest.Mock;
  },
  expected: Config,
) {
  if (!expected.error) {
    expect(actual.return).toEqual(expected.return);
  } else if (actual.error) {
    expect(actual.error.message).toEqual(ERROR.message);
    expect(actual.error.type).toEqual(ERROR.type);
    expect(actual.error.hook).toEqual(ERROR.hook);
    expect(actual.error.receiver).toEqual(ERROR.receiver);
  } else {
    throw new Error('Unexpected call result');
  }

  expect(actual.order.every((item, i) => [1, 2, 3][i] === item)).toBeTruthy();

  expect(first(actual.mock1.mock.calls)).toEqual(expected.calls1 || [0]);
  expect(first(actual.mock2.mock.calls)).toEqual(expected.calls2 || [0]);
  expect(first(actual.mock3.mock.calls)).toEqual(expected.calls3 || [0]);
}

export const testCallEmptySyncHooks = (
  Hook: HookConstructor,
  expected?: Value,
) => {
  const hook = new Hook('hook');
  expect(hook.call(1)).toEqual(expected);
};

export const testCallEmptyAsyncHooks = async (
  Hook: AsyncHookConstructor,
  expected?: Value,
) => {
  const hook = new Hook('hook');
  expect(await hook.call(1)).toEqual(expected);
};

export const testCallSyncHooks = (
  Hook: HookConstructor,
  config: Config = {},
) => {
  let index = 0;
  const order: number[] = [];
  const factory = (value: Value) => {
    const factoryIndex = ++index;
    return () => {
      order.push(factoryIndex);
      if (value instanceof Error) {
        throw value;
      } else if (typeof value === 'string') {
        throw new Error(value);
      }
      return value;
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
  let error: HookError | undefined;
  try {
    result = hook.call(0);
  } catch (err) {
    error = err as HookError;
  }

  asset(
    {
      return: result,
      error,
      order,
      mock1,
      mock2,
      mock3,
    },
    config,
  );
};

export const testCallAsyncHooks = async (
  Hook: AsyncHookConstructor,
  config: AsyncConfig = {},
) => {
  let index = 0;
  const order: number[] = [];
  const factory = (value: Value, timestamp: number) => {
    const factoryIndex = ++index;
    return () => {
      order.push(factoryIndex);
      return new Promise<number | undefined>((resolve, reject) => {
        setTimeout(() => {
          if (typeof value === 'string') {
            reject(value);
          } else if (value instanceof Error) {
            throw value;
          } else {
            resolve(value);
          }
        }, timestamp);
      });
    };
  };
  const mock1 = jest.fn(factory(pick(config, 'value1', 1), 30));
  const mock2 = jest.fn(factory(pick(config, 'value2', 2), 20));
  const mock3 = jest.fn(factory(pick(config, 'value3', 3), 10));
  const hook = new Hook('hook');
  hook.tap('A', mock1);
  hook.tap('B', mock2);
  hook.tap('C', mock3);
  let result: unknown;
  let error: HookError | undefined;
  const start = Date.now();
  try {
    result = await hook.call(0);
  } catch (err) {
    error = err as HookError;
  }
  if (config.cost) {
    const actualCost = Date.now() - start;
    const expectedCost = Number(config.cost.slice(1));
    if (config.cost.startsWith('>')) {
      expect(actualCost).toBeGreaterThan(expectedCost);
    } else {
      expect(actualCost).toBeLessThan(expectedCost);
    }
  }

  asset(
    {
      return: result,
      error,
      order,
      mock1,
      mock2,
      mock3,
    },
    config,
  );
};
