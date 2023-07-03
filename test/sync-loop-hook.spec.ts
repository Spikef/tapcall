import { SyncLoopHook } from 'tapcall';
import {
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
  testSyncHookError,
} from './common';

describe('SyncLoopHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(SyncLoopHook);
    testCreateNewHookWithArgs(SyncLoopHook);
  });

  describe('call', () => {
    it('should return undefined when no hooks', () => {
      const hook = new SyncLoopHook('hook');
      expect(hook.call()).toBeUndefined();
    });

    it('should return undefined when any hooks', () => {
      let loopCount = 0;
      const hook = new SyncLoopHook<[], boolean>('hook');
      const mock1 = jest.fn(() => (++loopCount < 3 ? true : undefined));
      const mock2 = jest.fn(() => (++loopCount < 5 ? true : undefined));
      hook.tap('A', mock1);
      hook.tap('B', mock2);
      expect(hook.call()).toBeUndefined();
      expect(mock1).toBeCalledTimes(3);
      expect(mock2).toBeCalledTimes(2);
    });
  });

  describe('error', () => {
    testSyncHookError(SyncLoopHook);
  });
});
