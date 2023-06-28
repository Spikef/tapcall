import { SyncHook } from 'tapcall';
import HookError from 'tapcall/util/hook-error';

describe('SyncHook', () => {
  describe('new', () => {
    it('should allow to create sync hooks', () => {
      const h0 = new SyncHook('h0');
      const h1 = new SyncHook<[a: string]>('h1');
      const h2 = new SyncHook<[a: string, b: number]>('h2');
      const h3 = new SyncHook<[a: string, b: number, c: boolean]>('h3');

      const mock = jest.fn();

      h0.tap('A', mock);
      h0.call();
      expect(mock).toHaveBeenLastCalledWith();

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
    it('should return an array of number values', () => {
      const hook = new SyncHook<[], number>('hook');
      hook.tap('A', () => 1);
      hook.tap('B', () => 2);
      hook.tap('C', () => 3);
      expect(hook.call()).toEqual([1, 2, 3]);
    });

    it('should return an array of string values', () => {
      const hook = new SyncHook<[val: string], string>('hook');
      hook.tap('A', (val) => val + '1');
      hook.tap('B', (val) => val + '2');
      hook.tap('C', (val) => val + '3');
      expect(hook.call('a')).toEqual(['a1', 'a2', 'a3']);
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
