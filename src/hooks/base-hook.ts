import HookError, { IErrorDetail } from '../util/hook-error';

export interface IOption {
  /**
   * 名称，用于区分不同的钩子执行函数
   */
  name: string;
  /**
   * 执行顺序，默认为0
   */
  stage?: number;
  /**
   * 前置依赖
   */
  before?: string | string[];
}

export default class BaseHook<
  Args extends unknown[] = [],
  Return = void,
  Callback extends (...args: Args) => Return = (...args: Args) => Return,
> {
  protected readonly options: IOption[] = [];
  protected readonly callbacks: Callback[] = [];

  constructor(private readonly name: string) {}

  /**
   * 监听钩子
   */
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

  /**
   * 触发钩子
   */
  call(...args: Args): void {
    for (let i = 0; i < this.callbacks.length; i++) {
      const name = this.options[i].name;
      const callback = this.callbacks[i];
      try {
        callback(...args);
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

  /**
   * 清除指定监听
   */
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

  /**
   * 清除所有监听
   */
  clearAll() {
    this.options.splice(0, this.options.length);
    this.callbacks.splice(0, this.callbacks.length);
  }

  protected createError(message: string, detail: IErrorDetail) {
    return new HookError(message, { ...detail, hook: this.name });
  }

  protected createPromise<Return>(
    name: string,
    args: Args,
    callback: (...args: Args) => Return | Promise<Return>,
  ) {
    return new Promise<Return>((resolve, reject) => {
      try {
        resolve(callback(...args));
      } catch (e) {
        reject(e);
      }
    }).catch((err) => {
      if (err instanceof Error) {
        return Promise.reject(
          this.createError(err.message, {
            type: 'call',
            receiver: name,
            stack: err.stack,
          }),
        );
      } else {
        return Promise.reject(
          this.createError(String(err), {
            type: 'call',
            receiver: name,
          }),
        );
      }
    });
  }
}
