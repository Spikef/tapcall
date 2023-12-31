import { AsyncSeriesBailHook } from 'tapcall';
import {
  testCallAsyncHooks,
  testCallEmptyAsyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from 'common';

describe('AsyncSeriesBailHook', () => {
  describe('new', () => {
    it('should allow to create async series bail hooks without args', () => {
      testCreateNewHookNoArgs(AsyncSeriesBailHook);
    });

    it('should allow to create async series bail hooks with args', () => {
      testCreateNewHookWithArgs(AsyncSeriesBailHook);
    });
  });

  describe('call', () => {
    it('should return undefined when no hook', async () => {
      await testCallEmptyAsyncHooks(AsyncSeriesBailHook);
    });

    it('should return the first NOT undefined value', async () => {
      await testCallAsyncHooks(AsyncSeriesBailHook, {
        value1: undefined,
        return: 2,
        cost: 6000,
        order: [1, 2],
        calls3: [],
      });
    });

    it('should reject if any callback rejects/throws', async () => {
      await testCallAsyncHooks(AsyncSeriesBailHook, {
        value1: undefined,
        value2: 'error message',
        value3: 'not reject this error because 3 will not run',
        error: true,
      });

      await testCallAsyncHooks(AsyncSeriesBailHook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('not reject this error because 3 will not run'),
        error: true,
      });
    });

    it('should not reject if a callback returns value before rejects/throws', async () => {
      await testCallAsyncHooks(AsyncSeriesBailHook, {
        value2: 'not reject this error because 2 will not run',
        value3: 'not reject this error because 3 will not run',
        return: 1,
        order: [1],
        calls2: [],
        calls3: [],
      });

      await testCallAsyncHooks(AsyncSeriesBailHook, {
        value2: new Error('not reject this error because 2 will not run'),
        value3: new Error('not reject this error because 3 will not run'),
        return: 1,
        order: [1],
        calls2: [],
        calls3: [],
      });
    });
  });
});
