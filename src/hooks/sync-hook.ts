import Hook from './base/hook';

export default class SyncHook<Args extends unknown[] = []> extends Hook<
  Args,
  void
> {}
