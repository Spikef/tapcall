import { AsyncSeriesBailHook } from 'tapcall';
import {
  testAsyncHookError,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from './common';

describe('AsyncSeriesBailHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(AsyncSeriesBailHook);
    testCreateNewHookWithArgs(AsyncSeriesBailHook);
  });

  describe('error', () => {
    testAsyncHookError(AsyncSeriesBailHook);
  });
});
