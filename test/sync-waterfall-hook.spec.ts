import { SyncWaterfallHook } from 'tapcall';
import {
  testCallEmptySyncHooks,
  testCallSyncHooks,
  testCreateNewHookWithArgs,
} from 'common';

describe('SyncWaterfallHook', () => {
  describe('new', () => {
    it('should allow to create sync waterfall hooks with args', () => {
      testCreateNewHookWithArgs(SyncWaterfallHook);
    });
  });

  describe('call', () => {
    it('should return the args[0] when no hooks', () => {
      testCallEmptySyncHooks(SyncWaterfallHook, 0);
    });

    it('should return the last value NOT undefined value', () => {
      testCallSyncHooks(SyncWaterfallHook, {
        args: [1, 2],
        value1: (a, b) => a + b, // 1 + 2 => 3
        value2: () => undefined,
        value3: (a, b) => a * b, // 3 * 2 => 6
        return: 6,
        calls1: [1, 2],
        calls2: [3, 2],
        calls3: [3, 2],
      });
    });

    it('should throw an error when callback throws error', () => {
      testCallSyncHooks(SyncWaterfallHook, {
        value1: undefined,
        value2: new Error('error message'),
        error: true,
      });
    });
  });
});
