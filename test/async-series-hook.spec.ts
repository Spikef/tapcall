import { AsyncSeriesHook } from 'tapcall';
import { testCreateNewHookNoArgs, testCreateNewHookWithArgs } from './common';

describe('AsyncSeriesHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(AsyncSeriesHook);
    testCreateNewHookWithArgs(AsyncSeriesHook);
  });
});
