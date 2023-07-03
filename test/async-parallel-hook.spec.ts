import { AsyncParallelHook } from 'tapcall';
import {
  testAsyncHookError,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from './common';

describe('AsyncParallelHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(AsyncParallelHook);
    testCreateNewHookWithArgs(AsyncParallelHook);
  });

  describe('call', () => {
    it('should return an array of number values', async () => {
      const hook = new AsyncParallelHook<[], number>('hook');
      hook.tap('A', () => 1);
      hook.tap('B', () => 2);
      hook.tap('C', () => 3);
      expect(await hook.call()).toEqual([1, 2, 3]);
    });

    it('should return an array of string values', async () => {
      const hook = new AsyncParallelHook<[val: string], string>('hook');
      hook.tap('A', (val) => val + '1');
      hook.tap('B', (val) => val + '2');
      hook.tap('C', (val) => val + '3');
      expect(await hook.call('a')).toEqual(['a1', 'a2', 'a3']);
    });

    it('should return an array of values asy', (done) => {
      const hook = new AsyncParallelHook<[], number>('hook');
      hook.tap('A', () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(1);
          }, 100);
        });
      });
      hook.tap('B', () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(2);
          }, 100);
        });
      });
      hook.tap('C', () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(3);
          }, 100);
        });
      });
      const start = Date.now();
      hook.call().then((res) => {
        expect(res).toEqual([1, 2, 3]);
        expect(Date.now() - start).toBeLessThan(200);
        done();
      });
    });
  });

  describe('error', () => {
    testAsyncHookError(AsyncParallelHook);
  });
});
