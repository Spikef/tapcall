import { SyncBailHook } from 'tapcall';
import {
  testCallEmptySyncHooks,
  testCallSyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from 'common';

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
    it('should return undefined when no hooks', () => {
      testCallEmptySyncHooks(SyncBailHook);
    });

    it('should return the first NOT undefined value', () => {
      testCallSyncHooks(SyncBailHook, {
        value1: undefined,
        return: 2,
      });
    });

    it('should throw an error when callback throws error', () => {
      testCallSyncHooks(SyncBailHook, {
        value1: undefined,
        value2: new Error('error message'),
        error: true,
        calls3: [],
      });
    });
  });
});
