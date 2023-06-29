import { SyncBailHook } from 'tapcall';
import HookError from 'tapcall/util/hook-error';

describe('SyncBailHook', () => {
  describe('new', () => {
    it('should allow to create sync bail hooks', () => {
      const h0 = new SyncBailHook('h0');
      const h1 = new SyncBailHook<[a: string]>('h1');
      const h2 = new SyncBailHook<[a: string, b: number]>('h2');
      const h3 = new SyncBailHook<[a: string, b: number, c: boolean]>('h3');

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
    it('should return undefined when no hooks', () => {
      const hook = new SyncBailHook<[], number>('hook');
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
    it('should throw an error when call', () => {
      const hook = new SyncBailHook('hook');

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
