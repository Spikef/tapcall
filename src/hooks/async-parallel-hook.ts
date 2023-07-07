import AsyncHook from './base/async-hook';

export default class AsyncParallelHook<
  Args extends unknown[] = [],
  Return = undefined,
> extends AsyncHook<Args, Return> {
  call(...args: Args): Promise<undefined> {
    const options = [...this.options];
    const callbacks = [...this.callbacks];
    const promises: Promise<Return>[] = callbacks.map((callback, i) => {
      const name = options[i].name;
      return this.runCallback(name, callback, args);
    });
    return Promise.all(promises).then(() => undefined);
  }
}
