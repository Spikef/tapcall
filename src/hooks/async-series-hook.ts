import BaseHook from './base-hook';

export default class AsyncSeriesHook<
  Args extends unknown[] = [],
  Return = void,
> extends BaseHook<Args, Return | void | Promise<Return | void>> {
  protected _call(args: Args) {
    let promise: Promise<Return | void> = Promise.resolve();
    for (let i = 0; i < this.callbacks.length; i++) {
      const callback = this.callbacks[i];
      promise = promise.then(() => callback(...args));
    }
    return promise;
  }
}
