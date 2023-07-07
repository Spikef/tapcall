import Hook from './base/hook';

export default class SyncWaterfallHook<
  Args extends [unknown, ...unknown[]],
> extends Hook<Args, Args[0] | undefined> {
  call(...args: Args): Args[0] {
    const newArgs: Args = [...args];
    const options = [...this.options];
    const callbacks = [...this.callbacks];
    const run = (i: number): Args[0] => {
      if (i >= callbacks.length) return newArgs[0];
      const name = options[i].name;
      const callback = callbacks[i];
      const result = this.runCallback(name, callback, newArgs);
      if (result !== undefined) newArgs[0] = result;
      return run(i + 1);
    };
    return run(0);
  }
}
