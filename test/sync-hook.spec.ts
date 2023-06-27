import { SyncHook } from 'tapcall';

describe('SyncHook', () => {
  it('should allow to create sync hooks', () => {
    const h0 = new SyncHook('h0');
    const h1 = new SyncHook<[a: string]>('h1');
    const h2 = new SyncHook<[a: string, b: number]>('h2');
    const h3 = new SyncHook<[a: string, b: number, c: number]>('h3');

    const mock0 = jest.fn();
    h0.tap('A', mock0);
    h0.call();
    expect(mock0).toHaveBeenLastCalledWith();

    const mock1 = jest.fn();
    h0.tap('B', mock1);
    h0.call();
    expect(mock1).toHaveBeenLastCalledWith();

    const mock2 = jest.fn();
    const mock3 = jest.fn();
    const mock4 = jest.fn();
    const mock5 = jest.fn();
    h1.tap('C', mock2);
    h2.tap('D', mock3);
    h3.tap('E', mock4);
    h3.tap('F', mock5);
    h1.call('1');
    h2.call('1', 2);
    h3.call('1', 2, 3);
    expect(mock2).toHaveBeenLastCalledWith('1');
    expect(mock3).toHaveBeenLastCalledWith('1', 2);
    expect(mock4).toHaveBeenLastCalledWith('1', 2, 3);
    expect(mock5).toHaveBeenLastCalledWith('1', 2, 3);

    // @ts-ignore
    // eslint-disable-next-line
    h3.call('x', 'y');
    expect(mock4).toHaveBeenLastCalledWith('x', 'y');
    expect(mock5).toHaveBeenLastCalledWith('x', 'y');
  });

  it('should sync execute hooks', () => {
    const h1 = new SyncHook('h1');
    const mockCall1 = jest.fn();
    const mockCall2 = jest.fn(() => 'B');
    const mockCall3 = jest.fn(() => 'C');
    h1.tap('A', mockCall1);
    h1.tap('B', mockCall2);
    h1.tap('C', mockCall3);
    expect(h1.call()).toEqual([undefined, 'B', 'C']);
    expect(mockCall1).toHaveBeenCalledTimes(1);
    expect(mockCall2).toHaveBeenCalledTimes(1);
    expect(mockCall3).toHaveBeenCalledTimes(1);
  });
});
