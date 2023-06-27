import { SyncWaterfallHook } from 'tapcall';

describe('SyncWaterfallHook', () => {
  it('should allow to create sync hooks', () => {
    const hook = new SyncWaterfallHook<[arg1: string, arg2: string]>('hook');

    const mock0 = jest.fn((arg) => arg + ',0');
    const mock1 = jest.fn((arg) => arg + ',1');
    const mock2 = jest.fn((arg) => arg + ',2');
    hook.tap('A', mock0);
    hook.tap('B', mock1);
    hook.tap('C', mock2);

    const returnValue0 = hook.call('sync', 'a2');
    expect(returnValue0).toBe('sync,0,1,2');
    expect(mock0).toHaveBeenLastCalledWith('sync', 'a2');
    expect(mock1).toHaveBeenLastCalledWith('sync,0', 'a2');
    expect(mock2).toHaveBeenLastCalledWith('sync,0,1', 'a2');
  });

  it('should allow to create waterfall hooks', () => {
    const h1 = new SyncWaterfallHook<[a: number]>('h1');
    const h2 = new SyncWaterfallHook<[a: number, b: number]>('h2');

    expect(h1.call(1)).toEqual(1);

    h1.tap('A', () => undefined);
    h2.tap('A', (a, b) => a + b);

    expect(h1.call(1)).toEqual(1);
    expect(h2.call(1, 2)).toEqual(3);

    let count = 1;
    count = h1.call(count + ++count); // 1 + 2 => 3
    count = h1.call(count + ++count); // 3 + 4 => 7
    count = h1.call(count + ++count); // 7 + 8 => 15
    expect(count).toEqual(15);
  });
});
