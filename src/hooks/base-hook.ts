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
      throw new Error(`[${this.name}] tap repeat name [${name}]`);
    }
    if (this.callbacks.some((cb) => cb === callback)) {
      throw new Error(`[${this.name}] tap repeat callback [${name}]`);
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
  call(...args: Args) {
    let index = 0;
    try {
      this.callbacks.forEach((cb, i) => {
        index = i;
        cb(...args);
      });
    } catch (err) {
      const e = err as Error;
      const name = this.options[index].name;
      throw new Error(`[${this.name}] call [${name}] error: ${e.message}`);
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
}
