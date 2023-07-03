import AsyncHook from './base/async-hook';

export default class AsyncParallelBailHook<
  Args extends unknown[] = [],
  Return = void,
> extends AsyncHook<Args, Return | Promise<Return>> {
  call(...args: Args): Promise<Return> {
    const promises = [];
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      promises.push(this.createPromise(name, args, callback));
    }
    return Promise.race(promises);
  }
}
