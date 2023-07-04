import { AsyncSeriesLoopHook } from 'tapcall';
import { testCreateNewHookNoArgs, testCreateNewHookWithArgs } from 'common';

describe('AsyncSeriesLoopHook', () => {
  describe('new', () => {
    it('should allow to create async series loop hooks without args', () => {
      testCreateNewHookNoArgs(AsyncSeriesLoopHook);
    });

    it('should allow to create async series loop hooks with args', () => {
      testCreateNewHookWithArgs(AsyncSeriesLoopHook);
    });
  });
});
