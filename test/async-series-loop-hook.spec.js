const { AsyncSeriesLoopHook } = require('tapable');
const {
  testCallAsyncHooks,
  testCallEmptyAsyncHooks,
  testCreateNewAsyncHookNoArgs,
  testCreateNewAsyncHookWithArgs,
} = require('./common');

describe('AsyncSeriesLoopHook', () => {
  describe('new', () => {
    it('should allow to create async series loop hooks without args', () => {
      testCreateNewAsyncHookNoArgs(AsyncSeriesLoopHook);
    });

    it('should allow to create async series loop hooks with args', () => {
      testCreateNewAsyncHookWithArgs(AsyncSeriesLoopHook);
    });
  });

  describe('call', () => {
    let loopCount = 0;

    it('should return undefined when no hook', async () => {
      await testCallEmptyAsyncHooks(AsyncSeriesLoopHook);
    });

    loopCount = 0;
    it('should return undefined no matter what value hooks return', async () => {
      await testCallAsyncHooks(AsyncSeriesLoopHook, {
        value1: () => (++loopCount < 3 ? 1 : undefined),
        value2: () => (++loopCount < 5 ? 2 : undefined),
        value3: () => undefined,
        cost: 21000,
        order: [1, 1, 1, 2, 1, 2, 3],
        calls1: [10, 20, 10, 20, 10, 20, 10, 20],
        calls2: [10, 20, 10, 20],
        calls3: [10, 20],
      });
    });

    it('should reject if any callback rejects/throws', async () => {
      await testCallAsyncHooks(AsyncSeriesLoopHook, {
        value1: undefined,
        value2: 'error message',
        value3: 'not throw this error because 3 will not run',
        error: true,
      });

      await testCallAsyncHooks(AsyncSeriesLoopHook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('not throw this error because 3 will not run'),
        error: true,
      });

      loopCount = 0;
      await testCallAsyncHooks(AsyncSeriesLoopHook, {
        value1: () => (++loopCount < 1 ? 1 : undefined),
        value2: 'error message',
        value3: 'not throw this error because 3 will not run',
        error: true,
      });

      loopCount = 0;
      await testCallAsyncHooks(AsyncSeriesLoopHook, {
        value1: () => (++loopCount < 1 ? 1 : undefined),
        value2: new Error('error message'),
        value3: new Error('not throw this error because 3 will not run'),
        error: true,
      });
    });
  });
});
