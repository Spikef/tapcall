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
        cost: [30, 35],
      });
    });

    it('should reject the first callback that rejects/throws', async () => {
      await testCallAsyncHooks(AsyncParallelBailHook, {
        value1: undefined,
        value2: 'error message',
        value3: 'other error message',
        error: true,
        order: [1, 2, 3],
        calls3: [0],
      });

      await testCallAsyncHooks(AsyncParallelBailHook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('other error message'),
        error: true,
        order: [1, 2, 3],
        calls3: [0],
      });
    });

    it('should not reject if returned value before rejects/throws', async () => {
      await testCallAsyncHooks(AsyncParallelBailHook, {
        value1: 1,
        value2: 'error message',
        value3: 'other error message',
        return: 1,
        order: [1, 2, 3],
        calls3: [0],
      });

      await testCallAsyncHooks(AsyncParallelBailHook, {
        value1: 1,
        value2: new Error('error message'),
        value3: new Error('other error message'),
        return: 1,
        order: [1, 2, 3],
        calls3: [0],
      });
    });
  });
});
