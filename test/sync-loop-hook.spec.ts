import { SyncLoopHook } from 'tapcall';
import {
  testCallEmptySyncHooks,
  testCallSyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from 'common';

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
    it('should return undefined when no hooks', () => {
      testCallEmptySyncHooks(SyncLoopHook);
    });

    it('should return undefined when any hooks', () => {
      let loopCount = 0;
      testCallSyncHooks(SyncLoopHook, {
        value1: () => (++loopCount < 3 ? 1 : undefined),
        value2: () => (++loopCount < 5 ? 2 : undefined),
        value3: () => undefined,
        order: [1, 1, 1, 2, 2, 3],
        calls1: [10, 20, 10, 20, 10, 20],
        calls2: [10, 20, 10, 20],
        calls3: [10, 20],
      });
    });

    it('should throw an error when callback throws error', () => {
      testCallSyncHooks(SyncLoopHook, {
        value1: undefined,
        value2: new Error('error message'),
        error: true,
      });
    });
  });
});
