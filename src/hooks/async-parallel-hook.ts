import BaseHook from './base-hook';

export default class AsyncParallelHook<
  Args extends unknown[] = [],
  Return = void,
> extends BaseHook<Args, Return | Promise<Return>> {
  call(...args: Args): Promise<Return[]> {
    const promises = [];
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      promises.push(
        new Promise<Return>((resolve, reject) => {
          try {
            resolve(callback(...args));
          } catch (e) {
            reject(e);
          }
        }).catch((err) => {
          if (err instanceof Error) {
            const e = err as Error;
            return Promise.reject(
              this.createError(e.message, {
                type: 'call',
                receiver: name,
                stack: e.stack,
              }),
            );
          } else {
            return Promise.reject(
              this.createError(String(err), {
                type: 'call',
                receiver: name,
              }),
            );
          }
        }),
      );
    }
    return Promise.all(promises);
  }
}
