import AsyncHook from './base/async-hook';

export default class AsyncSeriesLoopHook<
  Args extends unknown[] = [],
  Return = undefined,
> extends AsyncHook<Args, Return | undefined> {
  call(...args: Args) {
    const options = [...this.options];
    const callbacks = [...this.callbacks];
    const run = (i: number): Promise<undefined> => {
      if (i >= callbacks.length) return Promise.resolve(undefined);
      const name = options[i].name;
      const callback = callbacks[i];
      return this.runCallback(name, callback, args).then((result) => {
        if (result !== undefined) return run(0);
        return run(i + 1);
      });
    };
    return run(0);
  }
}
