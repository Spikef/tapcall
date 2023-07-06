import { AsyncSeriesHook } from 'tapcall';
import {
  testCallAsyncHooks,
  testCallEmptyAsyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from 'common';

describe('AsyncSeriesHook', () => {
  describe('new', () => {
    it('should allow to create async series hooks without args', () => {
      testCreateNewHookNoArgs(AsyncSeriesHook);
    });

    it('should allow to create async series hooks with args', () => {
      testCreateNewHookWithArgs(AsyncSeriesHook);
    });
  });

  describe('call', () => {
    it('should return undefined when no hook', async () => {
      await testCallEmptyAsyncHooks(AsyncSeriesHook);
    });

    it('should return undefined no matter what value hooks return', async () => {
      await testCallAsyncHooks(AsyncSeriesHook, {
        cost: 7000,
      });
    });

    it('should reject if any callback rejects/throws', async () => {
      await testCallAsyncHooks(AsyncSeriesHook, {
        value1: undefined,
        value2: 'error message',
        value3: 'not reject this error because 3 will not run',
        error: true,
      });

      await testCallAsyncHooks(AsyncSeriesHook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('not reject this error because 3 will not run'),
        error: true,
      });

      await testCallAsyncHooks(AsyncSeriesHook, {
        value1: 1,
        value2: 'error message',
        value3: 'not reject this error because 3 will not run',
        error: true,
      });

      await testCallAsyncHooks(AsyncSeriesHook, {
        value1: 1,
        value2: new Error('error message'),
        value3: new Error('not reject this error because 3 will not run'),
        error: true,
      });
    });
  });
});
