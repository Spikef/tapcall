import { AsyncParallelBailHook } from 'tapcall';
import {
  testAsyncHookError,
  testCreateNewHookNoArgs,
  testCreateNewHookWithArgs,
} from './common';

describe('AsyncParallelBailHook', () => {
  describe('new', () => {
    testCreateNewHookNoArgs(AsyncParallelBailHook);
    testCreateNewHookWithArgs(AsyncParallelBailHook);
  });

  describe('error', () => {
    testAsyncHookError(AsyncParallelBailHook);
  });
});
