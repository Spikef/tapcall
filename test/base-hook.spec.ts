import BaseHook from 'tapcall/hooks/base-hook';

describe('BaseHook', () => {
  it('should allow to insert hooks before others and in stages', () => {
    const hook = new BaseHook('hook');

    const calls: string[] = [];
    hook.tap('A', () => calls.push('A'));
    hook.tap(
      {
        name: 'B',
        before: 'A',
      },
      () => calls.push('B'),
    );

    calls.length = 0;
    hook.call();
    expect(calls).toEqual(['B', 'A']);

    hook.tap(
      {
        name: 'C',
        before: ['A', 'B'],
      },
      () => calls.push('C'),
    );

    calls.length = 0;
    hook.call();
    expect(calls).toEqual(['C', 'B', 'A']);

    hook.tap(
      {
        name: 'D',
        before: 'B',
      },
      () => calls.push('D'),
    );

    calls.length = 0;
    hook.call();
    expect(calls).toEqual(['C', 'D', 'B', 'A']);

    hook.tap(
      {
        name: 'E',
        stage: -5,
      },
      () => calls.push('E'),
    );
    hook.tap(
      {
        name: 'F',
        stage: -3,
      },
      () => calls.push('F'),
    );

    calls.length = 0;
    hook.call();
    expect(calls).toEqual(['E', 'F', 'C', 'D', 'B', 'A']);
  });

  it('should warn without a valid name', () => {
    jest.spyOn(console, 'warn').mockImplementation();

    const hook = new BaseHook('testHook');
    hook.tap('', () => undefined);

    if (process.env.NODE_ENV === 'development') {
      expect(console.warn).toHaveBeenCalledWith(
        '[hook] testHook: 需要对 tap 定义 name',
      );
    }
  });

  it('should return undefined', () => {
    const hook = new BaseHook('hook');
    expect(hook.call()).toBeUndefined();
  });
});
