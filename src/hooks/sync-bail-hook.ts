import Hook from './base/hook';

export default class SyncBailHook<
  Args extends unknown[] = [],
  Return = void,
> extends Hook<Args, Return | void> {
  call(...args: Args): Return | void {
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      const result = this.runCallback(name, callback, args);
      if (result !== undefined) return result;
    }
  }
}
