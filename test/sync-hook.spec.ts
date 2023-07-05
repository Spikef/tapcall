import { SyncHook } from 'tapcall';
import {
  testCallEmptySyncHooks,
  testCallSyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from 'common';

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
    it('should return undefined when no hooks', () => {
      testCallEmptySyncHooks(SyncHook);
    });

    it('should return undefined when any hooks', () => {
      testCallSyncHooks(SyncHook);
    });

    it('should throw an error when callback throws error', () => {
      testCallSyncHooks(SyncHook, {
        value2: new Error('error message'),
        error: true,
      });
    });
  });
});
