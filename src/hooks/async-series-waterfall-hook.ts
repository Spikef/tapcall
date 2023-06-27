import BaseHook from './base-hook';

export default class AsyncSeriesWaterfallHook<
  Args extends [unknown, ...unknown[]],
  Return = unknown,
> extends BaseHook<Args, Return | void | Promise<Return | void>> {
  protected _call(args) {
    let waterfall = args[0];
    let promise = Promise.resolve(waterfall);
    const rest = args.slice(1);
    for (let i = 0; i < this.callbacks.length; i++) {
      const callback = this.callbacks[i];
      promise = promise
        .then((waterfall) => {
          return callback(waterfall, ...rest);
        })
        .then((result) => {
          if (result !== undefined) waterfall = result;
          return waterfall;
        });
    }
    return promise;
  }
}
