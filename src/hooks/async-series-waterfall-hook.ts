import AsyncHook from './base/async-hook';

export default class AsyncSeriesWaterfallHook<
  Args extends [unknown, ...unknown[]],
> extends AsyncHook<Args, Args[0] | void> {
  call(...args: Args): Promise<Args[0] | void> {
    const newArgs: Args = [...args];
    let promise: Promise<Args[0] | void> | undefined;
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      promise = (
        promise
          ? promise.then(() => this.createPromise(name, newArgs, callback))
          : this.createPromise(name, newArgs, callback)
      ).then((waterfall) => {
        if (waterfall !== undefined) newArgs[0] = waterfall;
      });
    }
    return promise || Promise.resolve(newArgs[0]);
  }
}
