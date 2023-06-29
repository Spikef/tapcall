import { AsyncSeriesWaterfallHook } from 'tapcall';

describe('AsyncSeriesWaterfallHook', () => {
  describe('new', () => {
    it('should allow to create async series waterfall hooks', () => {
      const h1 = new AsyncSeriesWaterfallHook<[a: string]>('h1');
      const h2 = new AsyncSeriesWaterfallHook<[a: string, b: number]>('h2');
      const h3 = new AsyncSeriesWaterfallHook<
        [a: string, b: number, c: boolean]
      >('h3');

      const mock = jest.fn();

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
