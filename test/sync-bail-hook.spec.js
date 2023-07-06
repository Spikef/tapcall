const { SyncBailHook } = require('tapable');
const {
  testCallEmptySyncHooks,
  testCallSyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} = require('./common');

describe('SyncBailHook', () => {
  describe('new', () => {
    it('should allow to create sync bail hooks without args', () => {
      testCreateNewHookNoArgs(SyncBailHook);
    });

    it('should allow to create sync bail hooks with args', () => {
      testCreateNewHookWithArgs(SyncBailHook);
    });
  });

  describe('call', () => {
    it('should return undefined when no hook', () => {
      testCallEmptySyncHooks(SyncBailHook);
    });

    it('should return the first NOT undefined value', () => {
      testCallSyncHooks(SyncBailHook, {
        value1: undefined,
        return: 2,
        order: [1, 2],
        calls3: [],
      });
    });

    it('should throw if any callback throws', () => {
      testCallSyncHooks(SyncBailHook, {
        value1: undefined,
        value2: 'error message',
        value3: 'not throw this error because 3 will not run',
        error: true,
      });

      testCallSyncHooks(SyncBailHook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('not throw this error because 3 will not run'),
        error: true,
      });
    });

    it('should not throw if a callback returns value before throws', () => {
      testCallSyncHooks(SyncBailHook, {
        value2: 'not throw this error because 2 will not run',
        value3: 'not throw this error because 3 will not run',
        return: 1,
        order: [1],
        calls2: [],
        calls3: [],
      });

      testCallSyncHooks(SyncBailHook, {
        value2: new Error('not throw this error because 2 will not run'),
        value3: new Error('not throw this error because 3 will not run'),
        return: 1,
        order: [1],
        calls2: [],
      });
    });
  });
});
