import BaseHook from './base-hook';

export default class SyncWaterfallHook<
  Args extends [unknown, ...unknown[]],
> extends BaseHook<Args, Args[0] | void> {
  call(...args: Args): Args[0] {
    let name = '';
    try {
      const newArgs: Args = [...args];
      for (let i = 0; i < this.callbacks.length; i++) {
        name = this.options[i].name;
        const waterfall = this.callbacks[i](...newArgs);
        if (waterfall !== undefined) {
          newArgs[0] = waterfall;
        }
      }
      return newArgs[0];
    } catch (err) {
      const e = err as Error;
      throw this.createError(e.message, {
        type: 'call',
        receiver: name,
        stack: e.stack,
      });
    }
  }
}
