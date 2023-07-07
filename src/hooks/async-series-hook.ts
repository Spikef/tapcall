import AsyncHook from './base/async-hook';

export default class AsyncSeriesHook<
  Args extends unknown[] = [],
  Return = undefined,
> extends AsyncHook<Args, Return | undefined> {
  call(...args: Args): Promise<undefined> {
    const options = [...this.options];
    const callbacks = [...this.callbacks];
    const run = (i: number): Promise<undefined> => {
      if (i >= callbacks.length) return Promise.resolve(undefined);
      const name = options[i].name;
      const callback = callbacks[i];
      return this.runCallback(name, callback, args).then(() => run(i + 1));
    };
    return run(0);
  }
}
