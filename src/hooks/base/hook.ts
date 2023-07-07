import HookError, { IErrorDetail } from '../../util/hook-error';

export interface IOption {
  /**
   * unique name, used to identify the plugin
   */
  name: string;
  /**
   * the stage of the plugin, the smaller the number, the higher the priority, the default is 0
   */
  stage?: number;
  /**
   * the plugin to be inserted before
   */
  before?: string | string[];
}

/**
 * @internal
 */
export default class Hook<
  Args extends unknown[] = [],
  Return = undefined,
  Callback extends (...args: Args) => Return = (...args: Args) => Return,
> {
  protected readonly options: IOption[] = [];
  protected readonly callbacks: Callback[] = [];

  constructor(private readonly name: string) {}

  tap(option: string | IOption, callback: Callback) {
    if (typeof option === 'string') option = { name: option };
    if (typeof callback !== 'function') return;

    const name = option.name;
    if (this.options.some((opt) => opt.name === name)) {
      throw this.createError(`repeat name: ${name}`, {
        type: 'tap',
        receiver: name,
      });
    }
    if (this.callbacks.some((cb) => cb === callback)) {
      throw this.createError(`repeat callback`, {
        type: 'tap',
        receiver: name,
      });
    }

    let before: Set<string> | undefined;
    if (option.before === '*') {
      before = new Set(this.options.map((opt) => opt.name));
    } else if (option.before) {
      before = new Set(
        Array.isArray(option.before) ? option.before : [option.before],
      );
      for (const name of before.values()) {
        if (this.options.every((opt) => opt.name !== name)) {
          before.delete(name);
        }
      }
    }

    const stage = option.stage || 0;
    let i = this.options.length;
    while (i > 0) {
      i--;
      this.options[i + 1] = this.options[i];
      this.callbacks[i + 1] = this.callbacks[i];
      const n = this.options[i].name;
      const s = this.options[i].stage || 0;
      if (before) {
        if (before.has(n)) {
          before.delete(n);
          continue;
        }
        if (before.size > 0) {
          continue;
        }
      }
      if (s <= stage) {
        i++;
        break;
      }
    }

    this.options[i] = option;
    this.callbacks[i] = callback;
  }

  call(...args: Args) {
    const options = [...this.options];
    const callbacks = [...this.callbacks];
    const run = (i: number) => {
      if (i >= callbacks.length) return;
      const name = options[i].name;
      const callback = callbacks[i];
      this.runCallback(name, callback, args);
      run(i + 1);
    };
    run(0);
  }

  clear(callbacks: string | Callback | Array<string | Callback>) {
    if (!Array.isArray(callbacks)) {
      callbacks = [callbacks];
    }
    callbacks.forEach((callback) => {
      if (!callback) return;

      let index: number;
      if (typeof callback === 'function') {
        index = this.callbacks.indexOf(callback);
      } else {
        index = this.options.findIndex((opt) => opt.name === callback);
      }
      if (~index) {
        this.options.splice(index, 1);
        this.callbacks.splice(index, 1);
      }
    });
  }

  clearAll() {
    this.options.splice(0, this.options.length);
    this.callbacks.splice(0, this.callbacks.length);
  }

  protected createError(err: Error | unknown, detail: IErrorDetail) {
    if (err instanceof Error) {
      return new HookError(err.message, {
        ...detail,
        stack: err.stack,
        hook: this.name,
      });
    }
    return new HookError(String(err), { ...detail, hook: this.name });
  }

  protected runCallback(name: string, callback: Callback, args: Args) {
    try {
      return callback(...args);
    } catch (err) {
      throw this.createError(err, {
        type: 'call',
        receiver: name,
      });
    }
  }
}
