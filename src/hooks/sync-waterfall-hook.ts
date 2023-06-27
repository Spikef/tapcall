import BaseHook from './base-hook';

export default class SyncWaterfallHook<
  Args extends [unknown, ...unknown[]],
  Return = unknown,
> extends BaseHook<Args, Return | void> {
  protected _call(args) {
    let waterfall = args[0];
    const rest = args.slice(1);
    for (let i = 0; i < this.callbacks.length; i++) {
      const result = this.callbacks[i](waterfall, ...rest);
      if (result !== undefined) waterfall = result;
    }
    return waterfall;
  }
}
