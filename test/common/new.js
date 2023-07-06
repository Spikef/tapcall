exports.testCreateNewHookNoArgs = (Hook) => {
  const mock = jest.fn();
  const h0 = new Hook();
  h0.tap('A', mock);
  h0.call();
  expect(mock).toHaveBeenLastCalledWith();
};

exports.testCreateNewHookWithArgs = (Hook) => {
  const mock = jest.fn();
  const h1 = new Hook(['a']);
  const h2 = new Hook(['a', 'b']);
  const h3 = new Hook(['a', 'b', 'c']);

  h1.tap('A', mock);
  h1.call('1');
  expect(mock).toHaveBeenLastCalledWith('1');

  h2.tap('B', mock);
  h2.call('1', 2);
  expect(mock).toHaveBeenLastCalledWith('1', 2);

  h3.tap('C', mock);
  h3.call('1', 2, false);
  expect(mock).toHaveBeenLastCalledWith('1', 2, false);
};

exports.testCreateNewAsyncHookNoArgs = (Hook) => {
  const mock = jest.fn(() => Promise.resolve());
  const h0 = new Hook();
  h0.tapPromise('A', mock);
  h0.promise();
  expect(mock).toHaveBeenLastCalledWith();
};

exports.testCreateNewAsyncHookWithArgs = (Hook) => {
  const mock = jest.fn(() => Promise.resolve());
  const h1 = new Hook(['a']);
  const h2 = new Hook(['a', 'b']);
  const h3 = new Hook(['a', 'b', 'c']);

  h1.tapPromise('A', mock);
  h1.promise('1');
  expect(mock).toHaveBeenLastCalledWith('1');

  h2.tapPromise('B', mock);
  h2.promise('1', 2);
  expect(mock).toHaveBeenLastCalledWith('1', 2);

  h3.tapPromise('C', mock);
  h3.promise('1', 2, false);
  expect(mock).toHaveBeenLastCalledWith('1', 2, false);
};
