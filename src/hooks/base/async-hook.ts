import Hook from './hook';

/**
 * @internal
 */
export default class AsyncHook<
  Args extends unknown[] = [],
  Return = undefined,
> extends Hook<Args, Return | Promise<Return>> {
  protected runCallback(
    name: string,
    callback: (...args: Args) => Return | Promise<Return>,
    args: Args,
  ) {
    return new Promise<Return>((resolve, reject) => {
      try {
        resolve(callback(...args));
      } catch (err) {
        reject(err);
      }
    }).catch((err) => {
      throw this.createError(err, {
        type: 'call',
        receiver: name,
      });
    });
  }
}
