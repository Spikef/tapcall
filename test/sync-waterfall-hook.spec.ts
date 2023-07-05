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

    it('should throw an error when callback throws error', () => {
      testCallSyncHooks(SyncWaterfallHook, {
        value1: undefined,
        value2: new Error('error message'),
        error: true,
      });
    });
  });
});
