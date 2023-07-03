import HookError from 'tapcall/util/hook-error';

type HookInstance<Args extends unknown[] = []> = {
  tap(option: string, callback: (...args: Args) => unknown): void;
  call(...args: Args): void;
  clearAll(): void;
};
type AsyncHookInstance<Args extends unknown[] = []> = Pick<
  HookInstance,
  'tap' | 'clearAll'
> & {
  call(...args: Args): Promise<unknown>;
};
type HookConstructor = {
  new <Args extends unknown[] = []>(name: string): HookInstance<Args>;
};
type WaterfallHookConstructor = {
  new <Args extends [unknown, ...unknown[]] = [unknown]>(
    name: string,
  ): HookInstance<Args>;
};
type AsyncWaterfallHookConstructor = {
  new <Args extends [unknown, ...unknown[]] = [unknown]>(
    name: string,
  ): AsyncHookInstance<Args>;
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

export const testSyncHookError = (Hook: WaterfallHookConstructor) => {
  it('should throw an error when callback throws error', () => {
    const mock1 = jest.fn();
    const mock2 = jest.fn();
    const hook = new Hook('hook');
    hook.tap('A', mock1);
    hook.tap('B', () => {
      throw new Error('error message');
    });
    hook.tap('C', mock2);
    expect(() => hook.call(1)).toThrowError(
      new HookError('error message', {
        type: 'call',
        hook: 'hook',
        receiver: 'B',
      }),
    );
    expect(mock1).toBeCalledTimes(1);
    expect(mock2).toBeCalledTimes(0);
  });
};

export const testAsyncHookError = (Hook: AsyncWaterfallHookConstructor) => {
  const hook = new Hook('hook');

  beforeEach(() => {
    hook.clearAll();
  });

  const should = (done: jest.DoneCallback) => {
    hook
      .call(1)
      .catch((e) => {
        expect(e.type).toBe('call');
        expect(e.hook).toBe('hook');
        expect(e.receiver).toBe('B');
        expect(e.message).toBe('error message');
      })
      .then(done);
  };

  it('should reject with error when reject string', (done) => {
    hook.tap('A', jest.fn());
    hook.tap('B', () => {
      return Promise.reject('error message');
    });
    hook.tap('C', jest.fn());
    should(done);
  });

  it('should reject with error when reject error', (done) => {
    hook.tap('A', jest.fn());
    hook.tap('B', () => {
      return Promise.reject(new Error('error message'));
    });
    hook.tap('C', jest.fn());
    should(done);
  });

  it('should reject with error when throw error', (done) => {
    hook.tap('A', jest.fn());
    hook.tap('B', () => {
      throw new Error('error message');
    });
    hook.tap('C', jest.fn());
    should(done);
  });
};
