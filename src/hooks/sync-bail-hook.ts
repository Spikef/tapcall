import BaseHook from './base-hook';

export default class SyncBailHook<
  Args extends unknown[] = [],
  Return = unknown,
> extends BaseHook<Args, Return | void> {
  protected _call(args: Args) {
    for (let i = 0; i < this.callbacks.length; i++) {
      const result = this.callbacks[i](...args);
      if (result !== undefined) return result;
    }
    return;
  }
}
