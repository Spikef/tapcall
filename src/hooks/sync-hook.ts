import Hook from './base/hook';

export default class SyncHook<
  Args extends unknown[] = [],
  Return = undefined,
> extends Hook<Args, Return> {
  call(...args: Args): undefined {
    super.call(...args);
  }
}
