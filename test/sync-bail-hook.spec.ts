import { SyncBailHook } from 'tapcall';

describe('SyncBailHook', () => {
  it('should allow to create sync bail hooks', async () => {
    const h1 = new SyncBailHook<[a: number]>('h1');
    const h2 = new SyncBailHook<[a: number, b: number]>('h2');

    const r = h1.call(1);
    expect(r).toEqual(undefined);

    h1.tap('A', () => undefined);
    h2.tap('A', (a, b) => a + b);

    expect(h1.call(1)).toEqual(undefined);
    expect(h2.call(1, 2)).toEqual(3);

    h1.tap('B', (a) => 'ok' + a);
    h2.tap('B', () => 'wrong');

    expect(h1.call(10)).toEqual('ok10');
    expect(h2.call(10, 20)).toEqual([10, 20]);
  });

  it('should bail on non-null return', async () => {
    const h1 = new SyncBailHook('h1');
    const mockCall1 = jest.fn();
    const mockCall2 = jest.fn(() => 'B');
    const mockCall3 = jest.fn(() => 'C');
    h1.tap('A', mockCall1);
    h1.tap('B', mockCall2);
    h1.tap('C', mockCall3);
    expect(h1.call()).toEqual('B');
    expect(mockCall1).toHaveBeenCalledTimes(1);
    expect(mockCall2).toHaveBeenCalledTimes(1);
    expect(mockCall3).toHaveBeenCalledTimes(0);
  });

  it('should not crash with many plugins', () => {
    jest.spyOn(console, 'warn').mockImplementation();
    const hook = new SyncBailHook('testHook');
    for (let i = 0; i < 1000; i++) {
      hook.tap('Test', () => 42);
    }
    expect(hook.call()).toBe(42);
    if (process.env.NODE_ENV === 'development') {
      expect(console.warn).toHaveBeenCalledWith(
        '[hook] testHook: 对同一个hook定义了相同的name: Test',
      );
    }
  });
});
