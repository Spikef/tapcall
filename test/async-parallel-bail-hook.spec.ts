import { AsyncParallelBailHook } from 'tapcall';
import { testCreateNewHookNoArgs, testCreateNewHookWithArgs } from './common';
import HookError from 'tapcall/util/hook-error';

describe('AsyncParallelBailHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(AsyncParallelBailHook);
    testCreateNewHookWithArgs(AsyncParallelBailHook);
  });

  describe('call', () => {
    const calls: number[] = [];
    const createMock = (
      value: number | undefined | Error | string,
      timestamp: number,
    ) => {
      return jest.fn(() => {
        calls.push(timestamp);
        return new Promise<number | undefined>((resolve, reject) => {
          setTimeout(() => {
            calls.push(timestamp);
            if (typeof value === 'string') {
              reject(value);
            } else if (value instanceof Error) {
              throw value;
            } else {
              resolve(value);
            }
          }, timestamp);
        });
      });
    };

    it('should return undefined when no hooks', (done) => {
      const hook = new AsyncParallelBailHook('hook');
      hook.call().then((result) => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return the first NOT undefined value', (done) => {
      calls.length = 0;
      const hook = new AsyncParallelBailHook<[], number>('hook');
      const mock1 = createMock(undefined, 300);
      const mock2 = createMock(2, 200);
      const mock3 = createMock(3, 100);
      hook.tap('A', mock1);
      hook.tap('B', mock2);
      hook.tap('C', mock3);
      hook.call().then((result) => {
        expect(result).toBe(2);
        expect(mock1).toHaveBeenCalledTimes(1);
        expect(mock2).toHaveBeenCalledTimes(1);
        expect(mock3).toHaveBeenCalledTimes(1);
        expect(calls).toEqual([300, 200, 100, 100, 200, 300]);
        done();
      });
    });

    it('should return the first rejected status', (done) => {
      calls.length = 0;
      const hook = new AsyncParallelBailHook<[], number>('hook');
      const mock1 = createMock(undefined, 300);
      const mock2 = createMock('error message', 200);
      const mock3 = createMock(3, 100);
      hook.tap('A', mock1);
      hook.tap('B', mock2);
      hook.tap('C', mock3);
      hook.call().catch((err) => {
        expect(err).toBe(
          new HookError('error message', {
            type: 'call',
            hook: 'hook',
            receiver: 'B',
          }),
        );
        done();
      });
    });

    it('should not reject if returned value previously', (done) => {
      calls.length = 0;
      const hook = new AsyncParallelBailHook<[], number>('hook');
      const mock1 = createMock(1, 300);
      const mock2 = createMock('error message', 200);
      const mock3 = createMock(3, 100);
      hook.tap('A', mock1);
      hook.tap('B', mock2);
      hook.tap('C', mock3);
      hook.call().then((result) => {
        expect(result).toBe(1);
        expect(mock1).toHaveBeenCalledTimes(1);
        expect(mock2).toHaveBeenCalledTimes(1);
        expect(mock3).toHaveBeenCalledTimes(1);
        expect(calls).toEqual([300, 200, 100, 100, 200, 300]);
        done();
      });
    });
  });
});
