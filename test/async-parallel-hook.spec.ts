import { AsyncParallelHook } from 'tapcall';

describe('AsyncParallelHook', () => {
  describe('new', () => {
    it('should allow to create async parallel hooks', async () => {
      const h0 = new AsyncParallelHook('h0');
      const h1 = new AsyncParallelHook<[a: string]>('h1');
      const h2 = new AsyncParallelHook<[a: string, b: number]>('h2');
      const h3 = new AsyncParallelHook<[a: string, b: number, c: boolean]>(
        'h3',
      );

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
    it('should return an array of number values', async () => {
      const hook = new AsyncParallelHook<[], number>('hook');
      hook.tap('A', () => 1);
      hook.tap('B', () => 2);
      hook.tap('C', () => 3);
      expect(await hook.call()).toEqual([1, 2, 3]);
    });

    it('should return an array of string values', async () => {
      const hook = new AsyncParallelHook<[val: string], string>('hook');
      hook.tap('A', (val) => val + '1');
      hook.tap('B', (val) => val + '2');
      hook.tap('C', (val) => val + '3');
      expect(await hook.call('a')).toEqual(['a1', 'a2', 'a3']);
    });

    it('should return an array of values asy', (done) => {
      const hook = new AsyncParallelHook<[], number>('hook');
      hook.tap('A', () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(1);
          }, 100);
        });
      });
      hook.tap('B', () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(2);
          }, 100);
        });
      });
      hook.tap('C', () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(3);
          }, 100);
        });
      });
      const start = Date.now();
      hook.call().then((res) => {
        expect(res).toEqual([1, 2, 3]);
        expect(Date.now() - start).toBeLessThan(200);
        done();
      });
    });
  });

  describe('error', () => {
    it('should reject with error when reject string', (done) => {
      const hook = new AsyncParallelHook('hook');

      hook.tap('A', jest.fn());
      hook.tap('B', () => {
        return Promise.reject('error message');
      });
      hook.tap('C', jest.fn());
      hook
        .call()
        .catch((e) => {
          expect(e.type).toBe('call');
          expect(e.hook).toBe('hook');
          expect(e.receiver).toBe('B');
          expect(e.message).toBe('error message');
        })
        .then(done);
    });

    it('should reject with error when reject error', (done) => {
      const hook = new AsyncParallelHook('hook');

      hook.tap('A', jest.fn());
      hook.tap('B', () => {
        return Promise.reject(new Error('error message'));
      });
      hook.tap('C', jest.fn());
      hook
        .call()
        .catch((e) => {
          expect(e.type).toBe('call');
          expect(e.hook).toBe('hook');
          expect(e.receiver).toBe('B');
          expect(e.message).toBe('error message');
        })
        .then(done);
    });

    it('should reject with error when throw error', (done) => {
      const hook = new AsyncParallelHook('hook');

      hook.tap('A', jest.fn());
      hook.tap('B', () => {
        throw new Error('error message');
      });
      hook.tap('C', jest.fn());
      hook
        .call()
        .catch((e) => {
          expect(e.type).toBe('call');
          expect(e.hook).toBe('hook');
          expect(e.receiver).toBe('B');
          expect(e.message).toBe('error message');
        })
        .then(done);
    });
  });
});
