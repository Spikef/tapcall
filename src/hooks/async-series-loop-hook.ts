import AsyncHook from './base/async-hook';

export default class AsyncSeriesLoopHook<
  Args extends unknown[] = [],
  Return = void,
> extends AsyncHook<Args, Return | void> {
  call(...args: Args): Promise<Return | void> {
    let promise: Promise<Return | void> | undefined;
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      promise = promise
        ? promise.then(() => this.createPromise(name, args, callback))
        : this.createPromise(name, args, callback);
    }
    return promise || Promise.resolve();
  }
}
