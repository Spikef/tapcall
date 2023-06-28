import { SyncWaterfallHook } from 'tapcall';
import HookError from 'tapcall/util/hook-error';

describe('SyncWaterfallHook', () => {
  describe('new', () => {
    it('should allow to create sync waterfall hooks', () => {
      const h1 = new SyncWaterfallHook<[a: string]>('h1');
      const h2 = new SyncWaterfallHook<[a: string, b: number]>('h2');
      const h3 = new SyncWaterfallHook<[a: string, b: number, c: boolean]>(
        'h3',
      );

      const mock = jest.fn();

      h1.tap('B', mock);
      h1.call('1');
      expect(mock).toHaveBeenLastCalledWith('1');

      h2.tap('C', mock);
      h2.call('1', 2);
      expect(mock).toHaveBeenLastCalledWith('1', 2);

      h3.tap('D', mock);
      h3.call('1', 2, false);
      expect(mock).toHaveBeenLastCalledWith('1', 2, false);
    });
  });

  describe('call', () => {
    it('should return the args[0]', () => {
      const hook = new SyncWaterfallHook<[a: number]>('hook');
      expect(hook.call(1)).toBe(1);
    });

    it('should ignore the return undefined value', () => {
      const hook = new SyncWaterfallHook<[a: number]>('hook');
      const fn = jest.fn(() => undefined);
      hook.tap('A', fn);
      expect(hook.call(1)).toBe(1);
      expect(fn).toHaveBeenCalledTimes(1);
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
