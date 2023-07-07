import AsyncHook from './base/async-hook';

export default class AsyncSeriesBailHook<
  Args extends unknown[] = [],
  Return = undefined,
> extends AsyncHook<Args, Return | undefined> {
  call(...args: Args): Promise<Return | undefined> {
    const options = [...this.options];
    const callbacks = [...this.callbacks];
    const run = (i: number): Promise<Return | undefined> => {
      if (i >= callbacks.length) return Promise.resolve(undefined);
      const option = options[i];
      const callback = callbacks[i];
      return this.runCallback(option.name, callback, args).then((value) => {
        if (value !== undefined) return value;
        return run(i + 1);
      });
    };
    return run(0);
  }
}
