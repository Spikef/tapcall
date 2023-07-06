import AsyncHook from './base/async-hook';

export default class AsyncSeriesLoopHook<
  Args extends unknown[] = [],
  Return = void,
> extends AsyncHook<Args, Return | void> {
  call(...args: Args): Promise<Return | void> {
    let promise: Promise<Return | void> | undefined;
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];

      const run = () => {
        const runTask = (): Promise<void> => {
          return this.runCallback(name, callback, args).then((result) => {
            if (result === undefined) return;
            return runTask();
          });
        };
        return runTask();
      };

      promise = promise ? promise.then(run) : run();
    }
    return promise || Promise.resolve();
  }
}
