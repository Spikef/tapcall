import { AsyncSeriesWaterfallHook } from 'tapcall';

describe('AsyncSeriesWaterfallHook', () => {
  it('should allow to create async hooks', async () => {
    const hook = new AsyncSeriesWaterfallHook<[arg1: string, arg2: string]>(
      'hook',
    );

    const mock0 = jest.fn((arg) => arg + ',0');
    const mock1 = jest.fn((arg) => arg + ',1');
    const mock2 = jest.fn((arg) => arg + ',2');
    hook.tap('A', mock0);
    hook.tap('B', mock1);
    hook.tap('C', mock2);

    const returnValue0 = await hook.call('async', 'a2');
    expect(returnValue0).toBe('async,0,1,2');
    expect(mock0).toHaveBeenLastCalledWith('async', 'a2');
    expect(mock1).toHaveBeenLastCalledWith('async,0', 'a2');
    expect(mock2).toHaveBeenLastCalledWith('async,0,1', 'a2');
  });

  it('should allow to create async waterfall hooks', async () => {
    const h1 = new AsyncSeriesWaterfallHook<[a: number]>('h1');
    const h2 = new AsyncSeriesWaterfallHook<[a: number, b: number]>('h2');

    expect(await h1.call(1)).toEqual(1);

    h1.tap('A', () => undefined);
    h2.tap('A', (a, b) => a + b);

    expect(await h1.call(1)).toEqual(1);
    expect(await h2.call(1, 2)).toEqual(3);

    let count = 1;
    count = await h1.call(count + ++count); // 1 + 2 => 3
    count = await h1.call(count + ++count); // 3 + 4 => 7
    count = await h1.call(count + ++count); // 7 + 8 => 15
    expect(count).toEqual(15);
  });
});
