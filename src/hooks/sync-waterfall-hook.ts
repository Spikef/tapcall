import BaseHook from './base-hook';

export default class SyncWaterfallHook<
  Args extends [unknown, ...unknown[]],
> extends BaseHook<Args, Args[0] | void> {
  call(...args: Args): Args[0] {
    const newArgs: Args = [...args];
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      try {
        const waterfall = callback(...newArgs);
        if (waterfall !== undefined) newArgs[0] = waterfall;
      } catch (err) {
        const e = err as Error;
        throw this.createError(e.message, {
          type: 'call',
          receiver: name,
          stack: e.stack,
        });
      }
    }
    return newArgs[0];
  }
}
