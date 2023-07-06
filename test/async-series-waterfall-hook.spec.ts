import { AsyncSeriesWaterfallHook } from 'tapcall';
import {
  testCallAsyncHooks,
  testCallEmptyAsyncHooks,
  testCreateNewHookWithArgs,
} from 'common';

describe('AsyncSeriesWaterfallHook', () => {
  describe('new', () => {
    it('should allow to create async series waterfall hooks with args', () => {
      testCreateNewHookWithArgs(AsyncSeriesWaterfallHook);
    });
  });

  describe('call', () => {
    it('should return args[0] when no hooks', async () => {
      await testCallEmptyAsyncHooks(AsyncSeriesWaterfallHook, 10);
    });

    it('should return the last value NOT undefined value', async () => {
      await testCallAsyncHooks(AsyncSeriesWaterfallHook, {
        value1: (a, b) => a + b, // 10 + 20 => 30
        value2: () => undefined,
        value3: (a, b) => a * b, // 30 * 20 => 600
        return: 600,
        cost: 7000,
        calls1: [10, 20],
        calls2: [30, 20],
        calls3: [30, 20],
      });
    });

    it('should reject if any callback rejects/throws', async () => {
      await testCallAsyncHooks(AsyncSeriesWaterfallHook, {
        value1: undefined,
        value2: 'error message',
        value3: 'not reject this error because 3 will not run',
        error: true,
      });

      await testCallAsyncHooks(AsyncSeriesWaterfallHook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('not reject this error because 3 will not run'),
        error: true,
      });

      await testCallAsyncHooks(AsyncSeriesWaterfallHook, {
        value1: 1,
        value2: 'error message',
        value3: 'not reject this error because 3 will not run',
        error: true,
      });

      await testCallAsyncHooks(AsyncSeriesWaterfallHook, {
        value1: 1,
        value2: new Error('error message'),
        value3: new Error('not reject this error because 3 will not run'),
        error: true,
      });
    });
  });
});
