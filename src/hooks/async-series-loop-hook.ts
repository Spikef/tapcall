import AsyncHook from './base/async-hook';

export default class AsyncSeriesLoopHook<
  Args extends unknown[] = [],
  Return = void,
> extends AsyncHook<Args, Return | void> {
  call(...args: Args): Promise<Return | void> {
    const run = (i: number): Promise<void> => {
      if (i >= this.callbacks.length) return Promise.resolve();
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      return this.runCallback(name, callback, args).then((result) => {
        if (result === undefined) return run(i + 1);
        return run(0);
      });
    };

    return run(0);
  }
}
