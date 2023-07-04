import Hook from './base/hook';

export default class SyncLoopHook<
  Args extends unknown[] = [],
  Return = void,
> extends Hook<Args, Return | undefined> {
  call(...args: Args): undefined {
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      let result: Return | void | undefined;
      do {
        result = this.runCallback(name, callback, args);
      } while (result !== undefined);
    }
  }
}
