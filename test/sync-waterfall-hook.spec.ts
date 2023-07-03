import { SyncWaterfallHook } from 'tapcall';
import HookError from 'tapcall/util/hook-error';
import { testCreateNewHookWithArgs } from './common';

describe('SyncWaterfallHook', () => {
  describe('new', () => {
    testCreateNewHookWithArgs(SyncWaterfallHook);
  });

  describe('call', () => {
    it('should return the args[0] when no hooks', () => {
      const hook = new SyncWaterfallHook<[a: number]>('hook');
      expect(hook.call(1)).toBe(1);
    });

    it('should ignore the return undefined value', () => {
      const hook = new SyncWaterfallHook<[a: number]>('hook');
      const mock1 = jest.fn(() => undefined);
      const mock2 = jest.fn((a: number) => a + 2);
      hook.tap('A', mock1);
      expect(hook.call(1)).toBe(1);
      expect(mock1).toHaveBeenCalledTimes(1);
      hook.tap('B', mock2);
      expect(hook.call(1)).toBe(3);
    });

    it('should return the last value', () => {
      const hook = new SyncWaterfallHook<[a: number, b: number]>('hook');
      hook.tap('A', (a, b) => a + b); // 1 + 10 => 11
      hook.tap('B', (a, b) => a + b); // 11 + 10 => 21
      hook.tap('C', (a, b) => a + b); // 21 + 10 => 31
      expect(hook.call(1, 10)).toBe(31);
    });
  });

  describe('error', () => {
    it('should throw an error when call', () => {
      const hook = new SyncWaterfallHook<[a: number]>('hook');
      hook.tap('A', jest.fn());
      hook.tap('B', () => {
        throw new Error('error message');
      });
      hook.tap('C', jest.fn());
      expect(() => hook.call(1)).toThrowError(
        new HookError('error message', {
          type: 'call',
          hook: 'hook',
          receiver: 'B',
        }),
      );
    });
  });
});
