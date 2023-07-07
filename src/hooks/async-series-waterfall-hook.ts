import AsyncHook from './base/async-hook';

export default class AsyncSeriesWaterfallHook<
  Args extends [unknown, ...unknown[]],
> extends AsyncHook<Args, Args[0] | undefined> {
  call(...args: Args): Promise<Args[0]> {
    const newArgs: Args = [...args];
    const options = [...this.options];
    const callbacks = [...this.callbacks];
    const run = (i: number): Promise<Args[0]> => {
      if (i >= callbacks.length) return Promise.resolve(newArgs[0]);
      const name = options[i].name;
      const callback = callbacks[i];
      return this.runCallback(name, callback, newArgs).then((result) => {
        if (result !== undefined) newArgs[0] = result;
        return run(i + 1);
      });
    };
    return run(0);
  }
}
