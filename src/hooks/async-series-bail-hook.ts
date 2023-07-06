import AsyncHook from './base/async-hook';

export default class AsyncSeriesBailHook<
  Args extends unknown[] = [],
  Return = void,
> extends AsyncHook<Args, Return | void> {
  call(...args: Args): Promise<Return | void> {
    let promise: Promise<Return | void> | undefined;
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      promise = (
        promise
          ? promise.then(() => this.runCallback(name, callback, args))
          : this.runCallback(name, callback, args)
      ).then((value) => {
        if (value !== undefined) return Promise.reject(value);
      });
    }
    return (promise || Promise.resolve()).catch((err) => {
      if (err instanceof Error) {
        throw err;
      }
      return err;
    });
  }
}
