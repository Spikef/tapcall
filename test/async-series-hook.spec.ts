import { AsyncSeriesHook } from 'tapcall';

describe('AsyncSeriesHook', () => {
  describe('new', () => {
    it('should allow to create async series hooks', async () => {
      const h0 = new AsyncSeriesHook('h0');
      const h1 = new AsyncSeriesHook<[a: string]>('h1');
      const h2 = new AsyncSeriesHook<[a: string, b: number]>('h2');
      const h3 = new AsyncSeriesHook<[a: string, b: number, c: boolean]>('h3');

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
});
