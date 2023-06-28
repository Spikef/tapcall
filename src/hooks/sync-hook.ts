import BaseHook from './base-hook';

export default class SyncHook<
  Args extends unknown[] = [],
  Return = void,
> extends BaseHook<Args, Return> {
  call(...args: Args): Return[] {
    const result = [];
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      try {
        result.push(callback(...args));
      } catch (err) {
        const e = err as Error;
        throw this.createError(e.message, {
          type: 'call',
          receiver: name,
          stack: e.stack,
        });
      }
    }
    return result;
  }
}
