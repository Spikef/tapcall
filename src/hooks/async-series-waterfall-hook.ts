import BaseHook from './base-hook';

export default class AsyncSeriesWaterfallHook<
  Args extends [unknown, ...unknown[]],
  Return = unknown,
> extends BaseHook<Args, Return | void | Promise<Return | void>> {
  protected _call(args: Args) {
    const newArgs: Args = [...args];
    let promise = Promise.resolve(newArgs[0]);
    for (let i = 0; i < this.callbacks.length; i++) {
      const callback = this.callbacks[i];
      promise = promise
        .then(() => {
          return callback(...newArgs);
        })
        .then((waterfall) => {
          if (waterfall !== undefined) {
            newArgs[0] = waterfall;
          }
          return waterfall;
        });
    }
    return promise;
  }
}
