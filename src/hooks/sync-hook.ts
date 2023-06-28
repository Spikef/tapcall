import BaseHook from './base-hook';

export default class SyncHook<
  Args extends unknown[] = [],
  Return = void,
> extends BaseHook<Args, Return> {
  call(...args: Args): Return[] {
    let index = 0;
    try {
      return this.callbacks.map((cb, i) => {
        index = i;
        return cb(...args);
      });
    } catch (err) {
      const e = err as Error;
      const name = this.options[index].name;
      throw new Error(`[${this.name}] call [${name}] error: ${e.message}`);
    }
  }
}
