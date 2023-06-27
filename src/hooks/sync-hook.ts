import BaseHook from './base-hook';

export default class SyncHook<
  Args extends unknown[] = never,
  Return = void,
> extends BaseHook<Args, Return | void> {
  _call(args) {
    return this.callbacks.map((cb) => cb(...args));
  }
}
