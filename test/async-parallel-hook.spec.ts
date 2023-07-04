import { AsyncParallelHook } from 'tapcall';
import {
  testCallEmptyAsyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from 'common';

describe('AsyncParallelHook', () => {
  describe('new', () => {
    it('should allow to create async parallel hooks without args', () => {
      testCreateNewHookNoArgs(AsyncParallelHook);
    });

    it('should allow to create async parallel hooks with args', () => {
      testCreateNewHookWithArgs(AsyncParallelHook);
    });
  });

  describe('call', () => {
    it('should return undefined when no hooks', async () => {
      await testCallEmptyAsyncHooks(AsyncParallelHook);
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
});
