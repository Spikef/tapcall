import { SyncHook } from 'tapcall';
import HookError from 'tapcall/util/hook-error';
import { testCreateNewHookNoArgs, testCreateNewHookWithArgs } from './common';

describe('SyncHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(SyncHook);
    testCreateNewHookWithArgs(SyncHook);
  });

  describe('call', () => {
    it('should return undefined when no hooks', () => {
      const hook = new SyncHook<[]>('hook');
      expect(hook.call()).toBeUndefined();
    });

    it('should return undefined when any hooks', () => {
      const hook = new SyncHook<[]>('hook');
      const mock1 = jest.fn(() => 1);
      const mock2 = jest.fn(() => 2);
      const mock3 = jest.fn(() => 3);
      hook.tap('A', mock1);
      hook.tap('B', mock2);
      hook.tap('C', mock3);
      expect(hook.call()).toBeUndefined();
      expect(mock1).toHaveBeenCalledTimes(1);
      expect(mock2).toHaveBeenCalledTimes(1);
      expect(mock3).toHaveBeenCalledTimes(1);
    });
  });

  describe('error', () => {
    it('should throw an error when call', () => {
      const hook = new SyncHook('hook');

      hook.tap('A', jest.fn());
      hook.tap('B', () => {
        throw new Error('error message');
      });
      hook.tap('C', jest.fn());
      expect(() => hook.call()).toThrowError(
        new HookError('error message', {
          type: 'call',
          hook: 'hook',
          receiver: 'B',
        }),
      );
    });
  });
});
