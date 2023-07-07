import Hook from 'tapcall/hooks/base/hook';
import HookError from 'tapcall/util/hook-error';
import {
  testCallEmptySyncHooks,
  testCallSyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from 'common';

describe('BaseHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(Hook);
    testCreateNewHookWithArgs(Hook);
  });

  describe('call', () => {
    it('should return undefined when no hook', () => {
      testCallEmptySyncHooks(Hook);
    });

    it('should return undefined no matter what value hooks return', () => {
      testCallSyncHooks(Hook);
    });

    it('should throw if any callback throws', () => {
      testCallSyncHooks(Hook, {
        value1: undefined,
        value2: 'error message',
        value3: 'not reject this error because 3 will not run',
        error: true,
      });

      testCallSyncHooks(Hook, {
        value1: undefined,
        value2: new Error('error message'),
        value3: new Error('not reject this error because 3 will not run'),
        error: true,
      });

      testCallSyncHooks(Hook, {
        value2: 'error message',
        value3: 'not reject this error because 3 will not run',
        error: true,
      });

      testCallSyncHooks(Hook, {
        value2: new Error('error message'),
        value3: new Error('not reject this error because 3 will not run'),
        error: true,
      });
    });
  });

  describe('tap', () => {
    describe('tap error', () => {
      it('should throw an error when tap a same name', () => {
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        const hook = new Hook('hook');
        hook.tap('A', mock1);
        expect(() => hook.tap('A', mock2)).toThrowError(
          new HookError('repeat name: A', {
            type: 'tap',
            hook: 'hook',
            receiver: 'A',
          }),
        );
      });

      it('should throw an error when tap a same callback', () => {
        const mock1 = jest.fn();
        const hook = new Hook('hook');
        hook.tap('A', mock1);
        expect(() => hook.tap('B', mock1)).toThrowError(
          new HookError('repeat callback', {
            type: 'tap',
            hook: 'hook',
            receiver: 'B',
          }),
        );
      });
    });

    describe('tap order', () => {
      const hook = new Hook('hook');
      const call = jest.fn();
      const fn1 = () => call(1);
      const fn2 = () => call(2);
      const fn3 = () => call(3);
      const fn4 = () => call(4);
      const fn5 = () => call(5);

      beforeEach(() => {
        call.mockClear();
        hook.clearAll();
      });

      it('should insert B before A', () => {
        hook.tap('A', fn1);
        hook.tap(
          {
            name: 'B',
            before: 'A',
          },
          fn2,
        );
        hook.call();
        expect(call.mock.calls).toEqual([[2], [1]]);
      });

      it('should insert C before A and B', () => {
        hook.tap('A', fn1);
        hook.tap('B', fn2);
        hook.tap(
          {
            name: 'C',
            before: ['A', 'B'],
          },
          fn3,
        );
        hook.call();
        expect(call.mock.calls).toEqual([[3], [1], [2]]);
      });

      it('should insert C between A and B', () => {
        hook.tap('A', fn1);
        hook.tap('B', fn2);
        hook.tap(
          {
            name: 'C',
            before: 'B',
          },
          fn3,
        );
        hook.call();
        expect(call.mock.calls).toEqual([[1], [3], [2]]);
      });

      it('should insert hooks and in stages', () => {
        hook.tap(
          {
            name: 'A',
            stage: 20,
          },
          fn1,
        );
        hook.tap(
          {
            name: 'B',
            stage: 10,
          },
          fn2,
        );
        hook.tap('C', fn3);
        hook.tap(
          {
            name: 'D',
            stage: -10,
          },
          fn4,
        );
        hook.tap(
          {
            name: 'E',
            stage: -20,
          },
          fn5,
        );
        hook.call();
        expect(call.mock.calls).toEqual([[5], [4], [3], [2], [1]]);
      });

      it('should insert hooks before all', () => {
        hook.tap('A', fn1);
        hook.tap('B', fn2);
        hook.tap('C', fn3);
        hook.tap(
          {
            name: 'D',
            before: '*',
          },
          fn4,
        );
        hook.tap('E', fn5);
        hook.call();
        expect(call.mock.calls).toEqual([[4], [1], [2], [3], [5]]);
      });

      it('should ignore stage while before is not undefined', () => {
        hook.tap('A', fn1);
        hook.tap('B', fn2);
        hook.tap(
          {
            name: 'C',
            before: 'B',
            stage: -1,
          },
          fn3,
        );
        hook.call();
        expect(call.mock.calls).toEqual([[3], [1], [2]]);
      });

      it('should ignore before while no before hook added', () => {
        hook.tap('A', fn1);
        hook.tap(
          {
            name: 'B',
            before: 'C',
          },
          fn2,
        );
        hook.call();
        expect(call.mock.calls).toEqual([[1], [2]]);
      });

      it('should ignore before which is added previously', () => {
        hook.tap('A', fn1);
        hook.tap(
          {
            name: 'B',
            before: 'C',
          },
          fn2,
        );
        hook.tap(
          {
            name: 'C',
            stage: -10,
          },
          fn3,
        );
        hook.call();
        expect(call.mock.calls).toEqual([[3], [1], [2]]);
      });
    });
  });

  describe('clear', () => {
    const hook = new Hook('hook');
    const call = jest.fn();
    const fn1 = () => call(1);
    const fn2 = () => call(2);
    const fn3 = () => call(3);
    const fn4 = () => call(4);
    const fn5 = () => call(5);

    beforeEach(() => {
      call.mockClear();
      hook.clearAll();
      hook.tap('A', fn1);
      hook.tap('B', fn2);
      hook.tap('C', fn3);
      hook.tap('D', fn4);
      hook.tap('E', fn5);
    });

    it('should clear hooks by name', () => {
      hook.clear('A');
      hook.call();
      expect(call.mock.calls).toEqual([[2], [3], [4], [5]]);
    });

    it('should clear hooks by names', () => {
      hook.clear(['A', 'B', 'C']);
      hook.call();
      expect(call.mock.calls).toEqual([[4], [5]]);
    });

    it('should clear hooks by callback', () => {
      hook.clear(fn1);
      hook.call();
      expect(call.mock.calls).toEqual([[2], [3], [4], [5]]);
    });

    it('should clear hooks by callbacks', () => {
      hook.clear([fn1, fn2, fn3]);
      hook.call();
      expect(call.mock.calls).toEqual([[4], [5]]);
    });

    it('should clear all hooks', () => {
      hook.clearAll();
      hook.call();
      expect(call.mock.calls).toEqual([]);
    });
  });
});
