import { SyncLoopHook } from 'tapcall';
import {
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

    it('should throw an error when callback throws error', () => {
      testCallSyncHooks(SyncLoopHook, {
        value1: undefined,
        value2: new Error('error message'),
        error: true,
        calls3: [],
      });
    });
  });
});
