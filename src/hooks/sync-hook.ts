import Hook from './hook';

export default class SyncHook<Args extends unknown[] = []> extends Hook<
  Args,
  void
> {}
