import { AsyncParallelBailHook } from 'tapcall';
import {
  testCallAsyncHooks,
  testCallEmptyAsyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from 'common';

describe('AsyncParallelBailHook', () => {
  describe('new', () => {
    it('should allow to create async parallel bail hooks without args', () => {
      testCreateNewHookNoArgs(AsyncParallelBailHook);
    });

    it('should allow to create async parallel bail hooks with args', () => {
      testCreateNewHookWithArgs(AsyncParallelBailHook);
    });
  });

  describe('call', () => {
    it('should return undefined when no hooks', async () => {
      await testCallEmptyAsyncHooks(AsyncParallelBailHook);
    });

    it('should return the first NOT undefined value', async () => {
      await testCallAsyncHooks(AsyncParallelBailHook, {
        value1: undefined,
        return: 2,
        cost: [400, 420],
      });
    });

    it('should reject the first callback that rejects/throws', async () => {
      await testCallAsyncHooks(AsyncParallelBailHook, {
        value1: undefined,
        value2: 'error message',
        value3: 'not reject this error because 3 runs after 2',
        error: true,
        order: [1, 2, 3],
        calls3: [10, 20],
      });

      await testCallAsyncHooks(AsyncParallelBailHook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('not reject this error because 3 runs after 2'),
        error: true,
        order: [1, 2, 3],
        calls3: [10, 20],
      });
    });

    it('should not reject if returned value before rejects/throws', async () => {
      await testCallAsyncHooks(AsyncParallelBailHook, {
        value1: 1,
        value2: 'not reject this error because 1 resolves a value',
        value3: 'not reject this error because 1 resolves a value',
        return: 1,
        order: [1, 2, 3],
        calls3: [10, 20],
      });

      await testCallAsyncHooks(AsyncParallelBailHook, {
        value1: 1,
        value2: new Error('not reject this error because 1 resolves a value'),
        value3: new Error('not reject this error because 1 resolves a value'),
        return: 1,
        order: [1, 2, 3],
        calls3: [10, 20],
      });
    });
  });
});
