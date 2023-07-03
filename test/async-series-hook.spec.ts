import { AsyncSeriesHook } from 'tapcall';
import {
  testAsyncHookError,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from './common';

describe('AsyncSeriesHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(AsyncSeriesHook);
    testCreateNewHookWithArgs(AsyncSeriesHook);
  });

  describe('error', () => {
    testAsyncHookError(AsyncSeriesHook);
  });
});
