const { SyncLoopHook } = require('tapable');
const {
  testCallEmptySyncHooks,
  testCallSyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} = require('./common');

describe('SyncLoopHook', () => {
  describe('new', () => {
    it('should allow to create sync loop hooks without args', () => {
      testCreateNewHookNoArgs(SyncLoopHook);
    });

    it('should allow to create sync loop hooks with args', () => {
      testCreateNewHookWithArgs(SyncLoopHook);
    });
  });

  describe('call', () => {
    let loopCount = 0;

    it('should return undefined when no hook', () => {
      testCallEmptySyncHooks(SyncLoopHook);
    });

    it('should return undefined no matter what value hooks return', () => {
      loopCount = 0;
      testCallSyncHooks(SyncLoopHook, {
        value1: () => (++loopCount < 2 ? 1 : undefined),
        value2: () => (++loopCount < 5 ? 1 : undefined),
        value3: () => (++loopCount < 10 ? 1 : undefined),
        order: [1, 1, /**/ 2, 1, 2, /**/ 3, 1, 2, 3, 1, 2, 3],
        calls1: [10, 20, 10, 20, 10, 20, 10, 20, 10, 20],
        calls2: [10, 20, 10, 20, 10, 20, 10, 20],
        calls3: [10, 20, 10, 20, 10, 20],
      });
    });

    it('should throw if any callback throws', () => {
      testCallSyncHooks(SyncLoopHook, {
        value1: undefined,
        value2: 'error message',
        value3: 'not throw this error because 3 will not run',
        error: true,
      });

      testCallSyncHooks(SyncLoopHook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('not throw this error because 3 will not run'),
        error: true,
      });

      loopCount = 0;
      testCallSyncHooks(SyncLoopHook, {
        value1: () => (++loopCount < 1 ? 1 : undefined),
        value2: 'error message',
        value3: 'not throw this error because 3 will not run',
        error: true,
      });

      loopCount = 0;
      testCallSyncHooks(SyncLoopHook, {
        value1: () => (++loopCount < 1 ? 1 : undefined),
        value2: new Error('error message'),
        value3: new Error('not throw this error because 3 will not run'),
        error: true,
      });
    });
  });
});
