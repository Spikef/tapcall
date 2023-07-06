import { AsyncSeriesWaterfallHook } from 'tapcall';
import {
  testCallAsyncHooks,
  testCallEmptyAsyncHooks,
  testCreateNewHookWithArgs,
} from 'common';

describe('AsyncSeriesWaterfallHook', () => {
  describe('new', () => {
    it('should allow to create async series waterfall hooks with args', () => {
      testCreateNewHookWithArgs(AsyncSeriesWaterfallHook);
    });
  });

  describe('call', () => {
    it('should return undefined when no hooks', async () => {
      await testCallEmptyAsyncHooks(AsyncSeriesWaterfallHook);
    });

    it('should reject with error when reject error', async () => {
      await testCallAsyncHooks(AsyncSeriesWaterfallHook, {
        value1: undefined,
        value2: 'error message',
        error: true,
        calls3: [],
      });
    });

    it('should reject with error when throw error', async () => {
      await testCallAsyncHooks(AsyncSeriesWaterfallHook, {
        value1: undefined,
        value2: new Error('error message'),
        error: true,
        calls3: [],
      });
    });
  });
});
