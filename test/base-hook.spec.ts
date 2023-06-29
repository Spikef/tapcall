import Hook from 'tapcall/hooks/hook';
import HookError from 'tapcall/util/hook-error';

describe('BaseHook', () => {
  describe('new', () => {
    it('should allow to create base hooks', () => {
      const h0 = new Hook('h0');
      const h1 = new Hook<[a: string]>('h1');
      const h2 = new Hook<[a: string, b: number]>('h2');
      const h3 = new Hook<[a: string, b: number, c: boolean]>('h3');

      const mock = jest.fn();

      h0.tap('A', mock);
      h0.call();
      expect(mock).toHaveBeenLastCalledWith();

      h1.tap('B', mock);
      h1.call('1');
      expect(mock).toHaveBeenLastCalledWith('1');

      h2.tap('C', mock);
      h2.call('1', 2);
      expect(mock).toHaveBeenLastCalledWith('1', 2);

      h3.tap('D', mock);
      h3.call('1', 2, false);
      expect(mock).toHaveBeenLastCalledWith('1', 2, false);
    });
  });

  describe('call', () => {
    it('should return undefined when no hooks', () => {
      const hook = new Hook('hook');
      expect(hook.call()).toBeUndefined();
    });

    it('should return undefined when any hooks', () => {
      const hook = new Hook('hook');
      const mock1 = jest.fn(() => 1);
      const mock2 = jest.fn(() => 2);
      const mock3 = jest.fn(() => 3);
      hook.tap('A', mock1);
      hook.tap('B', mock2);
      hook.tap('C', mock3);
      expect(hook.call()).toBeUndefined();
      expect(mock1).toHaveBeenCalledTimes(1);
      expect(mock2).toHaveBeenCalledTimes(1);
      expect(mock3).toHaveBeenCalledTimes(1);
    });
  });

  describe('tap', () => {
    const hook = new Hook('hook');
    const calls: string[] = [];

    hook.tap('A', () => calls.push('A'));

    it('should insert B before A', () => {
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
    });

    it('should insert C before A and B, and keep B before A', () => {
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
    });

    it('should insert D before B, and after C', () => {
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
    });

    it('should insert hooks and in stages', () => {
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

    it('should insert hooks before all', () => {
      hook.tap(
        {
          name: 'G',
          before: '*',
        },
        () => calls.push('G'),
      );
      calls.length = 0;
      hook.call();
      expect(calls).toEqual(['G', 'E', 'F', 'C', 'D', 'B', 'A']);
    });

    it('should ignore stage while before is not undefined', () => {
      hook.tap(
        {
          name: 'H',
          before: 'F',
          stage: -1,
        },
        () => calls.push('H'),
      );
      calls.length = 0;
      hook.call();
      expect(calls).toEqual(['G', 'E', 'H', 'F', 'C', 'D', 'B', 'A']);
    });

    it('should ignore before while no before hook added', () => {
      hook.tap(
        {
          name: 'I',
          before: 'Z',
        },
        () => calls.push('I'),
      );
      calls.length = 0;
      hook.call();
      expect(calls).toEqual(['G', 'E', 'H', 'F', 'C', 'D', 'B', 'A', 'I']);
    });

    it('should ignore before which is added previously', () => {
      hook.tap(
        {
          name: 'Z',
          stage: -1,
        },
        () => calls.push('Z'),
      );
      calls.length = 0;
      hook.call();
      expect(calls).toEqual(['G', 'E', 'H', 'F', 'Z', 'C', 'D', 'B', 'A', 'I']);
    });
  });

  describe('clear', () => {
    const hook = new Hook('hook');
    const calls: string[] = [];

    const fnA = () => calls.push('A');
    hook.tap('A', fnA);
    const fnB = () => calls.push('B');
    hook.tap('B', fnB);
    const fnC = () => calls.push('C');
    hook.tap('C', fnC);
    const fnD = () => calls.push('D');
    hook.tap('D', fnD);
    const fnE = () => calls.push('E');
    hook.tap('E', fnE);
    const fnF = () => calls.push('F');
    hook.tap('F', fnF);
    const fnG = () => calls.push('G');
    hook.tap('G', fnG);
    const fnH = () => calls.push('H');
    hook.tap('H', fnH);

    it('should clear hooks by name', () => {
      hook.clear('A');
      calls.length = 0;
      hook.call();
      expect(calls).toEqual(['B', 'C', 'D', 'E', 'F', 'G', 'H']);
    });

    it('should clear hooks by names', () => {
      hook.clear(['B', 'C']);
      calls.length = 0;
      hook.call();
      expect(calls).toEqual(['D', 'E', 'F', 'G', 'H']);
    });

    it('should clear hooks by callback', () => {
      hook.clear(fnD);
      calls.length = 0;
      hook.call();
      expect(calls).toEqual(['E', 'F', 'G', 'H']);
    });

    it('should clear hooks by callbacks', () => {
      hook.clear([fnE, fnF]);
      calls.length = 0;
      hook.call();
      expect(calls).toEqual(['G', 'H']);
    });

    it('should clear all hooks', () => {
      hook.clearAll();
      calls.length = 0;
      hook.call();
      expect(calls).toEqual([]);
    });
  });

  describe('error', () => {
    const hook = new Hook('hook');

    it('should throw an error when tap a same name', () => {
      hook.clearAll();
      hook.tap('A', jest.fn());
      expect(() => hook.tap('A', jest.fn())).toThrowError(
        new HookError('repeat name: A', {
          type: 'tap',
          hook: 'hook',
          receiver: 'A',
        }),
      );
    });

    it('should throw an error when tap a same callback', () => {
      const fn = jest.fn();
      hook.clearAll();
      hook.tap('A', fn);
      expect(() => hook.tap('B', fn)).toThrowError(
        new HookError('repeat callback', {
          type: 'tap',
          hook: 'hook',
          receiver: 'B',
        }),
      );
    });

    it('should throw an error when call', () => {
      hook.clearAll();
      hook.tap('A', jest.fn());
      hook.tap('B', () => {
        throw new Error('error message');
      });
      hook.tap('C', jest.fn());
      expect(() => hook.call()).toThrowError(
        new HookError('error message', {
          type: 'call',
          hook: 'hook',
          receiver: 'B',
        }),
      );
    });
  });
});
