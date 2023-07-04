import { SyncHook } from 'tapcall';
import {
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
      const hook = new SyncHook('hook');
      expect(hook.call()).toBeUndefined();
    });

    it('should return undefined when any hooks', () => {
      const hook = new SyncHook('hook');
      const mock1 = jest.fn(() => 1);
      hook.tap('A', mock1);
      expect(hook.call()).toBeUndefined();
      expect(mock1).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when callback throws error', () => {
      testCallSyncHooks(SyncHook, {
        value2: new Error('error message'),
        error: true,
        calls3: [],
      });
    });
  });
});
