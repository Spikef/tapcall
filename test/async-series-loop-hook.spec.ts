import { AsyncSeriesLoopHook } from 'tapcall';
import {
  testCallAsyncHooks,
  testCallEmptyAsyncHooks,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from 'common';

describe('AsyncSeriesLoopHook', () => {
  describe('new', () => {
    it('should allow to create async series loop hooks without args', () => {
      testCreateNewHookNoArgs(AsyncSeriesLoopHook);
    });

    it('should allow to create async series loop hooks with args', () => {
      testCreateNewHookWithArgs(AsyncSeriesLoopHook);
    });
  });

  describe('call', () => {
    it('should return undefined when no hook', async () => {
      await testCallEmptyAsyncHooks(AsyncSeriesLoopHook);
    });

    it('should return undefined no matter what value hooks return', async () => {
      await testCallAsyncHooks(AsyncSeriesLoopHook);
    });
  });
});
