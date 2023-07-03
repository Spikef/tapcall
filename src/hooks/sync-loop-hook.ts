import Hook from './base/hook';

export default class SyncLoopHook<
  Args extends unknown[] = [],
  Return = void,
> extends Hook<Args, Return | undefined> {
  call(...args: Args): undefined {
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      try {
        let result: Return | void | undefined;
        do {
          result = callback(...args);
        } while (result !== undefined);
      } catch (err) {
        const e = err as Error;
        throw this.createError(e.message, {
          type: 'call',
          receiver: name,
          stack: e.stack,
        });
      }
    }
  }
}
