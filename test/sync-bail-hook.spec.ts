import { SyncBailHook, SyncHook } from 'tapcall';
import {
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
  testSyncHookError,
} from './common';

describe('SyncBailHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(SyncHook);
    testCreateNewHookWithArgs(SyncHook);
  });

  describe('call', () => {
    it('should return undefined when no hooks', () => {
      const hook = new SyncBailHook('hook');
      expect(hook.call()).toBeUndefined();
    });

    it('should return the last value', () => {
      const hook = new SyncBailHook<[], number>('hook');
      const mock1 = jest.fn(() => undefined);
      const mock2 = jest.fn(() => 2);
      const mock3 = jest.fn(() => 3);
      hook.tap('A', mock1);
      hook.tap('B', mock2);
      hook.tap('C', mock3);
      expect(hook.call()).toBe(2);
      expect(mock1).toHaveBeenCalledTimes(1);
      expect(mock2).toHaveBeenCalledTimes(1);
      expect(mock3).toHaveBeenCalledTimes(0);
    });
  });

  describe('error', () => {
    testSyncHookError(SyncBailHook);
  });
});
