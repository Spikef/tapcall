const { SyncWaterfallHook } = require('tapable');
const {
  testCallEmptySyncHooks,
  testCallSyncHooks,
  testCreateNewHookWithArgs,
} = require('./common');

describe('SyncWaterfallHook', () => {
  describe('new', () => {
    it('should allow to create sync waterfall hooks with args', () => {
      testCreateNewHookWithArgs(SyncWaterfallHook);
    });
  });

  describe('call', () => {
    it('should return the args[0] when no hooks', () => {
      testCallEmptySyncHooks(SyncWaterfallHook, 10);
    });

    it('should return the last value NOT undefined value', () => {
      testCallSyncHooks(SyncWaterfallHook, {
        value1: (a, b) => a + b, // 10 + 20 => 30
        value2: () => undefined,
        value3: (a, b) => a * b, // 30 * 20 => 600
        return: 600,
        calls1: [10, 20],
        calls2: [30, 20],
        calls3: [30, 20],
      });
    });

    it('should throw if any callback throws', () => {
      testCallSyncHooks(SyncWaterfallHook, {
        value1: undefined,
        value2: 'error message',
        value3: 'not throw this error because 3 will not run',
        error: true,
      });

      testCallSyncHooks(SyncWaterfallHook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('not throw this error because 3 will not run'),
        error: true,
      });

      testCallSyncHooks(SyncWaterfallHook, {
        value2: 'error message',
        value3: 'not throw this error because 3 will not run',
        error: true,
        calls2: [1, 20],
      });

      testCallSyncHooks(SyncWaterfallHook, {
        value2: new Error('error message'),
        value3: new Error('not throw this error because 3 will not run'),
        error: true,
        calls2: [1, 20],
      });
    });
  });
});
