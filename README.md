# TapCall

A simple [tapable](https://github.com/webpack/tapable) like hook module for plugins, which is friendly for typescript user.

> [中文文档 | The Chinese Document](./README.zh-CN.md)

## Installation

```bash
npm install tapcall
```

## Usage

All Hook constructors take one argument, which is the hook's name.

```javascript
import { SyncHook } from 'tapcall';
const hook = new SyncHook('some-hook-name');
```

You can set the generic type of the hook if you are using typescript:

```typescript
const hook = new SyncHook<[string, number], string>('some-hook-name');
```

Or you can use tuple labels for better readability:

```typescript
const hook = new SyncHook<[arg1: string, arg2: number], string>('some-hook-name');
```

The best practice is to expose all hooks of a class in a hooks property:

```typescript
class Cat {
  constructor() {
    this.hooks = {
      A: new SyncHook<[a: string]>(),
      B: new SyncHook<[b: number]>(),
    };
  }

  /* ... */
}
```

Other people can now use these hooks:

```typescript
const cat = new Cat();

// Use the tap method to add a callback
cat.hooks.A.tap('some-plugin-name', (a) => console.log(a));
```

It's required to pass a name to identify the plugin.

The class declaring these hooks need to call them:

```typescript
class Cat {
  /**
  * You won't get returned value from SyncHook or AsyncParallelHook,
  * to do that, use SyncWaterfallHook and AsyncSeriesWaterfallHook respectively
  **/

	setA(a: string) {
		// following call returns undefined even when you returned values
		this.hooks.A.call(a);
	}
}
```

## API

All Hook class has the following methods.

### tap(option, callback)

Register a callback to the hook.

- option: string | object
  - option.name: string, the name of the callback
  - option.stage?: number, the stage of the callback
  - option.before?: string | string[], the name of the callback before which the new callback will be inserted
- callback: function, the callback to be registered
  - *args: the arguments passed to the callback, which is the same as the first generic type of the hook*
  - *return: the returned value of the callback, which is the same as the second generic type of the hook*

### call(...args)

Call all callbacks registered to the hook. The return value is determined by the hook type.

- args: the arguments passed to the callback, which is the same as the generic type of the hook

### clear(callbacks)

Clear specify callbacks registered to the hook.

- callbacks: string | string[] | function | function[], the callbacks(or names) to be cleared

### clearAll()

Clear all callbacks registered to the hook.

## Hook Types

### SyncHook

`SyncHook` is a synchronous hook. It calls all callbacks registered to the hook in order.
If an error occurs when executing a callback, it will end early and throw a custom error.

The return value of the `call` method is `undefined`.

### SyncBailHook

`SyncBailHook` is a synchronous hook. It calls all callbacks registered to the hook in order.
If an error occurs when executing a callback, it will end early and throw a custom error.
If a callback returns a value(except `undefined`), it will end early and return the value.

The return value of the `call` method is the returned value of the last executed callback.

### SyncLoopHook

`SyncLoopHook` is a synchronous hook. It calls all callbacks registered to the hook in order.
If an error occurs when executing a callback, it will end early and throw a custom error.
Each callback will be called multiple times until it returns `undefined`, then it will call the next callback.

The return value of the `call` method is `undefined`.

### SyncWaterfallHook

`SyncWaterfallHook` is a synchronous hook. It calls all callbacks registered to the hook in order.
If an error occurs when executing a callback, it will end early and throw a custom error.
The return value of a callback will be passed to the next callback.

The return value of the `call` method is the returned value of the last callback.

### AsyncParallelHook

`AsyncParallelHook` is an asynchronous hook. It calls all callbacks registered to the hook in parallel.

The `call` method returns a promise, which resolves `undefined`.
If a callback occurs an error or rejects a promise, it will end early and `reject` the promise with a custom error.

### AsyncParallelBailHook

`AsyncParallelBailHook` is an asynchronous hook. It calls all callbacks registered to the hook in parallel.

The `call` method returns a promise, which resolves the first returned value(except `undefined`) of the callbacks.
If a callback occurs an error or rejects a promise, it will end early and `reject` the promise with a custom error.

### AsyncSeriesHook

`AsyncSeriesHook` is an asynchronous hook. It calls all callbacks registered to the hook in order.
If a callback occurs an error or rejects a promise, it will end early and `reject` the promise with a custom error.

The `call` method returns a promise, which resolves `undefined`.

### AsyncSeriesBailHook

`AsyncSeriesBailHook` is an asynchronous hook. It calls all callbacks registered to the hook in order.
If a callback occurs an error or rejects a promise, it will end early and `reject` the promise with a custom error.
If a callback returns a value(except `undefined`), it will end early and resolve the promise with the value.

The `call` method returns a promise, which resolves the returned value of the last executed callback.

### AsyncSeriesLoopHook

`AsyncSeriesLoopHook` is an asynchronous hook. It calls all callbacks registered to the hook in order.
If a callback occurs an error or rejects a promise, it will end early and `reject` the promise with a custom error.
Each callback will be called multiple times until it returns `undefined`, then it will call the next callback.

The `call` method returns a promise, which resolves `undefined`.

### AsyncSeriesWaterfallHook

`AsyncSeriesWaterfallHook` is an asynchronous hook. It calls all callbacks registered to the hook in order.
If a callback occurs an error or rejects a promise, it will end early and `reject` the promise with a custom error.
The return value of a callback will be passed to the next callback.

The `call` method returns a promise, which resolves the returned value of the last callback.

## Custom Error

When an error occurs, a custom error will be thrown or rejected. The error has the following properties:

- message: string, the error message
- type: string, the error occurred type
- hook: string, the name of the hook
- receiver: string, the name of the receiver
- stack: string, the original error stack trace
