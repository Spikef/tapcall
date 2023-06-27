import { AsyncParallelHook } from 'tapcall';

describe('AsyncParallelHook', () => {
  it('should allow to create async hooks', async () => {
    const hook = new AsyncParallelHook<[arg1: string, arg2: string], string>(
      'hook',
    );

    const mock0 = jest.fn((arg) => arg + ',0');
    const mock1 = jest.fn((arg) => arg + ',1');
    const mock2 = jest.fn((arg) => arg + ',2');
    hook.tap('A', mock0);
    hook.tap('B', mock1);
    hook.tap('C', mock2);

    const returnValue0 = await hook.call('async', 'a2');
    expect(returnValue0).toEqual(['async,0', 'async,1', 'async,2']);
    expect(mock0).toHaveBeenLastCalledWith('async', 'a2');
    expect(mock1).toHaveBeenLastCalledWith('async', 'a2');
    expect(mock2).toHaveBeenLastCalledWith('async', 'a2');
  });

  it('should allow to create async parallel hooks', async () => {
    const h1 = new AsyncParallelHook<[a: number], number>('h1');
    const h2 = new AsyncParallelHook<[a: number, b: number], number>('h2');

    expect(await h1.call(1)).toEqual([]);

    h1.tap('A', (a) => a);
    h2.tap('A', (a, b) => a + b);

    expect(await h1.call(1)).toEqual([1]);
    expect(await h2.call(1, 2)).toEqual([3]);
  });

  it('should throw with sync error', async () => {
    const hook = new AsyncParallelHook('hook');

    hook.tap('A', function () {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      return a; // a is not defined
    });

    try {
      await hook.call();
    } catch (e) {
      const err = e as Error;
      expect(err.message).toBe('[hook] 处理 A 失败: a is not defined');
    }
  });

  it('should reject with sync error', (done) => {
    const hook = new AsyncParallelHook('hook');

    hook.tap('A', function () {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      return a; // a is not defined
    });

    hook
      .call()
      .catch((e) => {
        expect(e.message).toBe('[hook] 处理 A 失败: a is not defined');
      })
      .then(done);
  });
});
