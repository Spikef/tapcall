import { SyncHook } from 'tapcall';
import {
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
  testSyncHookError,
} from './common';

describe('SyncHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(SyncHook);
    testCreateNewHookWithArgs(SyncHook);
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
  });

  describe('error', () => {
    testSyncHookError(SyncHook);
  });
});
