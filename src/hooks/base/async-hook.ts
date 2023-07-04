import Hook from './hook';

/**
 * @internal
 */
export default class AsyncHook<
  Args extends unknown[] = [],
  Return = void,
> extends Hook<Args, Return | Promise<Return>> {
  protected runCallback(
    name: string,
    callback: (...args: Args) => Return | Promise<Return>,
    args: Args,
  ) {
    return new Promise<Return>((resolve, reject) => {
      try {
        resolve(callback(...args));
      } catch (e) {
        reject(e);
      }
    }).catch((err) => {
      throw this.createError(err, {
        type: 'call',
        receiver: name,
      });
    });
  }

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
      throw this.createError(err, {
        type: 'call',
        receiver: name,
      });
    });
  }
}
