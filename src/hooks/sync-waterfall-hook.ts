import BaseHook from './base-hook';

export default class SyncWaterfallHook<
  Args extends [unknown, ...unknown[]],
> extends BaseHook<Args, Args[0] | undefined> {
  call(...args: Args): Args[0] {
    return super.call(...args);
  }

  protected _call(args: Args) {
    const newArgs: Args = [...args];
    for (let i = 0; i < this.callbacks.length; i++) {
      const waterfall = this.callbacks[i](...newArgs);
      if (waterfall !== undefined) {
        newArgs[0] = waterfall;
      }
    }
    return newArgs[0];
  }
}
