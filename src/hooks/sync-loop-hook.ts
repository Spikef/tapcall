import Hook from './base/hook';

export default class SyncLoopHook<
  Args extends unknown[] = [],
  Return = void,
> extends Hook<Args, Return | undefined> {
  call(...args: Args): undefined {
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      const result = this.runCallback(name, callback, args);
      if (result !== undefined) i = -1;
    }
  }
}
