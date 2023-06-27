import BaseHook from './base-hook';

export default class AsyncParallelHook<
  Args extends unknown[] = [],
  Return = void,
> extends BaseHook<Args, Return | Promise<Return>> {
  protected _call(args: Args) {
    return Promise.all(
      this.callbacks.map((callback, i) => {
        try {
          return callback(...args);
        } catch (e) {
          const err = e as Error;
          const { name } = this.options[i];
          return Promise.reject(
            new Error(`[hook] 处理 ${name} 失败: ${err.message}`),
          );
        }
      }),
    );
  }
}
