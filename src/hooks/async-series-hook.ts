import BaseHook from './base-hook';

export default class AsyncSeriesHook<
  Args extends unknown[] = never,
  Return = void,
> extends BaseHook<Args, Return | Promise<Return>> {
  protected _call(args) {
    let promise = Promise.resolve();
    for (let i = 0; i < this.callbacks.length; i++) {
      const callback = this.callbacks[i];
      promise = promise.then(() => callback(...args));
    }
    return promise;
  }
}
