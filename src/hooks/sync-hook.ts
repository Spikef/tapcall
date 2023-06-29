import Hook from './hook';

export default class SyncHook<
  Args extends unknown[] = [],
  Return = void,
> extends Hook<Args, Return> {}
