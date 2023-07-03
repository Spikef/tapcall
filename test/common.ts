type HookConstructor = {
  new <Args extends unknown[]>(name: string): HookInstance<Args>;
};
type WaterfallHookConstructor = {
  new <Args extends [unknown, ...unknown[]]>(name: string): HookInstance<Args>;
};
type HookInstance<Args extends unknown[] = []> = {
  tap(option: string, callback: (...args: Args) => unknown): void;
  call(...args: Args): void;
};

export const testCreateNewHookNoArgs = (Hook: HookConstructor) => {
  it('should allow to create base hooks without args', () => {
    const mock = jest.fn();
    const h0 = new Hook('h0');
    h0.tap('A', mock);
    h0.call();
    expect(mock).toHaveBeenLastCalledWith();
  });
};

export const testCreateNewHookWithArgs = (Hook: WaterfallHookConstructor) => {
  it('should allow to create base hooks with args', () => {
    const mock = jest.fn();
    const h1 = new Hook<[a: string]>('h1');
    const h2 = new Hook<[a: string, b: number]>('h2');
    const h3 = new Hook<[a: string, b: number, c: boolean]>('h3');

    h1.tap('A', mock);
    h1.call('1');
    expect(mock).toHaveBeenLastCalledWith('1');

    h2.tap('B', mock);
    h2.call('1', 2);
    expect(mock).toHaveBeenLastCalledWith('1', 2);

    h3.tap('C', mock);
    h3.call('1', 2, false);
    expect(mock).toHaveBeenLastCalledWith('1', 2, false);
  });
};
