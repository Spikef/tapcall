import AsyncHook from './base/async-hook';
import HookError from '../util/hook-error';

export default class AsyncParallelBailHook<
  Args extends unknown[] = [],
  Return = void,
> extends AsyncHook<Args, Return | void> {
  call(...args: Args): Promise<Return | void> {
    const promises = [];
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      promises.push(
        this.runCallback(name, callback, args).catch((err) =>
          Promise.resolve(err),
        ),
      );
    }
    return Promise.all(promises).then((results) => {
      for (let i = 0; i < results.length; i++) {
        if (results[i] instanceof HookError) {
          return Promise.reject(results[i]);
        } else if (results[i] !== undefined) {
          return Promise.resolve(results[i]);
        }
      }
    });
  }
}
