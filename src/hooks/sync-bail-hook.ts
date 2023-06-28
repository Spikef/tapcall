import BaseHook from './base-hook';

export default class SyncBailHook<
  Args extends unknown[] = [],
  Return = void,
> extends BaseHook<Args, Return | void> {
  call(...args: Args): Return | void {
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      try {
        const result = callback(...args);
        if (result !== undefined) return result;
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
