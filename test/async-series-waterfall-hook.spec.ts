import { AsyncSeriesWaterfallHook } from 'tapcall';
import { testCreateNewHookWithArgs } from './common';

describe('AsyncSeriesWaterfallHook', () => {
  describe('new', () => {
    testCreateNewHookWithArgs(AsyncSeriesWaterfallHook);
  });
});
