import AsyncHook from './base/async-hook';

export default class AsyncParallelBailHook<
  Args extends unknown[] = [],
  Return = undefined,
> extends AsyncHook<Args, Return | undefined> {
  call(...args: Args): Promise<Return | undefined> {
    const options = [...this.options];
    const callbacks = [...this.callbacks];
    const promises = callbacks.map((callback, i) => {
      const name = options[i].name;
      return this.runCallback(name, callback, args)
        .then((result) => {
          return {
            status: 'fulfilled' as const,
            value: result,
          };
        })
        .catch((err) => {
          return {
            status: 'rejected' as const,
            reason: err,
          };
        });
    });
    return Promise.all(promises).then((results) => {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === 'fulfilled' && result.value !== undefined) {
          return result.value;
        } else if (result.status === 'rejected') {
          throw result.reason;
        }
      }
    });
  }
}
