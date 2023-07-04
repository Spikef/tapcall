import Hook from './base/hook';

export default class SyncWaterfallHook<
  Args extends [unknown, ...unknown[]],
> extends Hook<Args, Args[0] | void> {
  call(...args: Args): Args[0] {
    const newArgs: Args = [...args];
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      const result = this.runCallback(name, callback, newArgs);
      if (result !== undefined) newArgs[0] = result;
    }
    return newArgs[0];
  }
}
