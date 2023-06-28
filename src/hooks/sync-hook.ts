import BaseHook from './base-hook';

export default class SyncHook<
  Args extends unknown[] = [],
  Return = void,
> extends BaseHook<Args, Return> {
  call(...args: Args): Return[] {
    let name = '';
    try {
      const result = [];
      for (let i = 0; i < this.callbacks.length; i++) {
        name = this.options[i].name;
        result.push(this.callbacks[i](...args));
      }
      return result;
    } catch (err) {
      const e = err as Error;
      throw new Error(`[${this.name}] call [${name}] error: ${e.message}`);
    }
  }
}
