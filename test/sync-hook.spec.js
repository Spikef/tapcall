const { SyncHook } = require('tapable');
const {
  testCallEmptySyncHooks,
  testCallSyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} = require('./common');

describe('SyncHook', () => {
  describe('new', () => {
    it('should allow to create sync hooks without args', () => {
      testCreateNewHookNoArgs(SyncHook);
    });

    it('should allow to create sync hooks with args', () => {
      testCreateNewHookWithArgs(SyncHook);
    });
  });

  describe('call', () => {
    it('should return undefined when no hook', () => {
      testCallEmptySyncHooks(SyncHook);
    });

    it('should return undefined no matter what value hooks return', () => {
      testCallSyncHooks(SyncHook);
    });

    it('should throw if any callback throws', () => {
      testCallSyncHooks(SyncHook, {
        value1: undefined,
        value2: 'error message',
        value3: 'not throw this error because 3 will not run',
        error: true,
      });

      testCallSyncHooks(SyncHook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('not throw this error because 3 will not run'),
        error: true,
      });

      testCallSyncHooks(SyncHook, {
        value2: new Error('error message'),
        error: true,
      });
    });
  });
});
