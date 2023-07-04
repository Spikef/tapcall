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
    it('should return undefined when no hooks', (done) => {
      const hook = new AsyncParallelHook('hook');
      hook.call().then((result) => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return undefined when any hooks', (done) => {
      const hook = new AsyncParallelHook<[], number>('hook');
      hook.tap('A', () => 1);
      hook.tap('B', () => 2);
      hook.tap('C', () => 3);
      hook.call().then((result) => {
        expect(result).toBeUndefined();
        done();
      });
    });
  });

  describe('error', () => {
    testAsyncHookError(AsyncParallelHook);
  });
});
