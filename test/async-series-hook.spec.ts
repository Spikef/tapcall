import { AsyncSeriesHook } from 'tapcall';
import { testCreateNewHookNoArgs, testCreateNewHookWithArgs } from 'common';

describe('AsyncSeriesHook', () => {
  describe('new', () => {
    it('should allow to create async series hooks without args', () => {
      testCreateNewHookNoArgs(AsyncSeriesHook);
    });

    it('should allow to create async series hooks with args', () => {
      testCreateNewHookWithArgs(AsyncSeriesHook);
    });
  });
});
