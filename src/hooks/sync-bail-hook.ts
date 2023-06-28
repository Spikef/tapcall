import BaseHook from './base-hook';

export default class SyncBailHook<
  Args extends unknown[] = [],
  Return = void,
> extends BaseHook<Args, Return | void> {
  call(...args: Args): Return | void {
    let name = '';
    try {
      for (let i = 0; i < this.callbacks.length; i++) {
        name = this.options[i].name;
        const result = this.callbacks[i](...args);
        if (result !== undefined) return result;
      }
    } catch (err) {
      const e = err as Error;
      throw new Error(`[${this.name}] call [${name}] error: ${e.message}`);
    }
  }
}
