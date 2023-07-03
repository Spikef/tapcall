import { AsyncSeriesLoopHook } from 'tapcall';
import {
  testAsyncHookError,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from './common';

describe('AsyncSeriesLoopHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(AsyncSeriesLoopHook);
    testCreateNewHookWithArgs(AsyncSeriesLoopHook);
  });

  describe('error', () => {
    testAsyncHookError(AsyncSeriesLoopHook);
  });
});
