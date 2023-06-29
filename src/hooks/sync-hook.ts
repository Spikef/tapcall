import BaseHook from './base-hook';

export default class SyncHook<
  Args extends unknown[] = [],
  Return = void,
> extends BaseHook<Args, Return> {}
