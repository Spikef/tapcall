import { AsyncParallelHook } from 'tapcall';
import {
  testCallAsyncHooks,
  testCallEmptyAsyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from 'common';

describe('AsyncParallelHook', () => {
  describe('new', () => {
    it('should allow to create async parallel hooks without args', () => {
      testCreateNewHookNoArgs(AsyncParallelHook);
    });

    it('should allow to create async parallel hooks with args', () => {
      testCreateNewHookWithArgs(AsyncParallelHook);
    });
  });

  describe('call', () => {
    it('should return undefined when no hook', async () => {
      await testCallEmptyAsyncHooks(AsyncParallelHook);
    });

    it('should return undefined no matter what value hooks return', async () => {
      await testCallAsyncHooks(AsyncParallelHook, {
        cost: 4000,
      });
    });

    it('should reject if any callback that rejects/throws', async () => {
      await testCallAsyncHooks(AsyncParallelHook, {
        value1: 'not reject this error because 1 rejects after 2',
        value2: 'error message',
        value3: undefined,
        error: true,
        order: [1, 2, 3],
        calls3: [10, 20],
      });

      await testCallAsyncHooks(AsyncParallelHook, {
        value1: new Error('not reject this error because 1 throws after 2'),
        value2: new Error('error message'),
        value3: undefined,
        error: true,
        order: [1, 2, 3],
        calls3: [10, 20],
      });

      await testCallAsyncHooks(AsyncParallelHook, {
        value1: 'not reject this error because 1 rejects after 2',
        value2: 'error message',
        error: true,
        order: [1, 2, 3],
        calls3: [10, 20],
      });

      await testCallAsyncHooks(AsyncParallelHook, {
        value1: new Error('not reject this error because 1 throws after 2'),
        value2: new Error('error message'),
        error: true,
        order: [1, 2, 3],
        calls3: [10, 20],
      });
    });
  });
});
