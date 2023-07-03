import Hook from './hook';

/**
 * @internal
 */
export default class AsyncHook<
  Args extends unknown[] = [],
  Return = void,
> extends Hook<Args, Return> {
  protected createPromise<Return>(
    name: string,
    args: Args,
    callback: (...args: Args) => Return | Promise<Return>,
  ) {
    return new Promise<Return>((resolve, reject) => {
      try {
        resolve(callback(...args));
      } catch (e) {
        reject(e);
      }
    }).catch((err) => {
      if (err instanceof Error) {
        return Promise.reject(
          this.createError(err.message, {
            type: 'call',
            receiver: name,
            stack: err.stack,
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
    });
  }
}
