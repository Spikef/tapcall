import { HookConstructor } from './type';

export const testCreateNewHookNoArgs = (Hook: HookConstructor) => {
  const mock = jest.fn();
  const h0 = new Hook('h0');
  h0.tap('A', mock);
  h0.call();
  expect(mock).toHaveBeenLastCalledWith();
};

export const testCreateNewHookWithArgs = (Hook: HookConstructor) => {
  const mock = jest.fn();
  const h1 = new Hook('h1');
  const h2 = new Hook('h2');
  const h3 = new Hook('h3');

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
