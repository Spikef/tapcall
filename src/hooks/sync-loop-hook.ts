import Hook from './base/hook';

export default class SyncLoopHook<
  Args extends unknown[] = [],
  Return = undefined,
> extends Hook<Args, Return | undefined> {
  call(...args: Args): undefined {
    const options = [...this.options];
    const callbacks = [...this.callbacks];
    const run = (i: number): undefined => {
      if (i >= callbacks.length) return;
      const name = options[i].name;
      const callback = callbacks[i];
      const result = this.runCallback(name, callback, args);
      if (result !== undefined) return run(0);
      return run(i + 1);
    };
    return run(0);
  }
}
