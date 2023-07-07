type HookInstance = {
  tap(option: string, callback: (...args: unknown[]) => unknown): void;
  call(...args: unknown[]): unknown;
  clearAll(): void;
};

type AsyncHookInstance = Exclude<HookInstance, 'call'> & {
  call(...args: unknown[]): Promise<unknown>;
};

export type HookConstructor = {
  new (name: string): HookInstance;
};

export type AsyncHookConstructor = {
  new (name: string): AsyncHookInstance;
};
