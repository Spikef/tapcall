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
  Args extends unknown[] = never,
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
    if (typeof option !== 'object' || typeof callback !== 'function') return;

    try {
      this._tap(option, callback);
    } catch (e) {
      const err = e as Error;
      throw new Error(`[hook: ${this.name}.tap] ${err.message}`);
    }
  }

  /**
   * 触发钩子
   */
  call(...args: Args) {
    try {
      return this._call(args);
    } catch (e) {
      const err = e as Error;
      throw new Error(`[hook: ${this.name}.call] ${err.message}`);
    }
  }

  /**
   * 清除tap
   */
  clear(callbacks: Callback | Callback[]) {
    if (!Array.isArray(callbacks)) callbacks = [callbacks];
    return this._clear(callbacks);
  }

  /**
   * 清除所有tap
   */
  clearAll() {
    return this._clear(this.callbacks.slice());
  }

  /**
   * 监听钩子
   */
  protected _tap(option: IOption, callback: Callback) {
    if (~this.callbacks.indexOf(callback)) {
      throw new Error(`[hook] ${this.name}: repeat callback`);
    }
    if (this.options.some((opt) => opt.name === option.name)) {
      throw new Error(`[hook] ${this.name}: repeat name [${option.name}]`);
    }

    let before;
    if (typeof option.before === 'string') {
      before = new Set([option.before]);
    } else if (Array.isArray(option.before)) {
      before = new Set(option.before);
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
  protected _call(args: Args) {
    this.callbacks.forEach((cb) => cb(...args));
  }

  /**
   * 清除监听
   */
  protected _clear(callbacks: Callback[]) {
    callbacks.forEach((callback) => {
      if (!callback || typeof callback !== 'function') return;

      const index = this.callbacks.indexOf(callback);
      if (~index) {
        this.options.splice(index, 1);
        this.callbacks.splice(index, 1);
      }
    });
  }
}
