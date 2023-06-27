import BaseHook from './base-hook';

export default class SyncHook<
  Args extends unknown[] = never,
  Return = void,
> extends BaseHook<Args, Return | void> {
  protected _call(args: Args) {
    return this.callbacks.map((cb) => cb(...args));
  }
}
