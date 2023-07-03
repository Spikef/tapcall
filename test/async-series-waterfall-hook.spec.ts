import { AsyncSeriesWaterfallHook } from 'tapcall';
import { testAsyncHookError, testCreateNewHookWithArgs } from './common';

describe('AsyncSeriesWaterfallHook', () => {
  describe('new', () => {
    testCreateNewHookWithArgs(AsyncSeriesWaterfallHook);
  });

  describe('error', () => {
    testAsyncHookError(AsyncSeriesWaterfallHook);
  });
});
