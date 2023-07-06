import AsyncHook from './base/async-hook';

export default class AsyncSeriesHook<
  Args extends unknown[] = [],
  Return = void,
> extends AsyncHook<Args, Return | void> {
  call(...args: Args): Promise<void> {
    let promise: Promise<Return | void> | undefined;
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      promise = promise
        ? promise.then(() => this.runCallback(name, callback, args))
        : this.runCallback(name, callback, args);
    }
    return promise?.then(() => undefined) || Promise.resolve();
  }
}
