# TapCall

一个简单的类似于 [tapable](https://github.com/webpack/tapable) 的钩子模块，对于 typescript 用户更加友好。

> [英文文档 | The English Document](./README.md)

## 安装

```bash
npm install tapcall
```

## 使用

所有钩子构造函数都接受一个参数，即钩子的名称。

```javascript
import { SyncHook } from 'tapcall';
const hook = new SyncHook('some-hook-name');
```

如果你使用 typescript，可以设置钩子的泛型：

```typescript
const hook = new SyncHook<[string, number], string>('some-hook-name');
```

或者你可以使用元组标签来提高可读性：

```typescript
const hook = new SyncHook<[arg1: string, arg2: number], string>('some-hook-name');
```

最佳实践是在一个 hooks 属性中暴露类的所有钩子：

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

其他人现在可以使用这些钩子：

```typescript
const cat = new Cat();

// 使用 tap 方法添加一个回调
cat.hooks.A.tap('some-plugin-name', (a) => console.log(a));
```

需要传递一个名称来标识插件。

声明这些钩子的类需要调用它们：

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

所有的钩子都有以下方法：

### tap(option, callback)

向 hook 注册一个回调。

- option: string | object
  - option.name: string，回调的名称
  - option.stage?: number，回调的执行顺序
  - option.before?: string | string[]，在哪个回调之前插入新的回调
- callback: function，要注册的回调
  - *args: 传递给回调的参数，与钩子的第一个泛型类型对应*
  - *return: 回调的返回值，与钩子的第二个泛型类型对应*

### call(...args)

调用 hook 的所有回调。不同的钩子有不同的返回值类型。

- args: 传递给回调的参数，与钩子的第一个泛型类型对应

### clear(callbacks)

清除 hook 的指定回调。

- callbacks: string | string[] | function | function[]，要清除的回调(或名称)

### clearAll()

清除 hook 的所有回调。

## 钩子类型

### SyncHook

`SyncHook`为串行同步执行，会按照先后顺序执行所有的回调。
如果执行某个回调时出错，则提前结束，并抛出一个自定义的错误。

`call`方法返回结果为`undefined`。

### SyncBailHook

`SyncBailHook`为串行同步执行，会按照先后顺序执行所有的回调。
如果执行某个回调时出错，则提前结束，并抛出一个自定义的错误。
如果执行某个回调时的返回值不为`undefined`，则提前结束。

`call`方法返回结果为最后一个执行回调的返回值。

### SyncLoopHook

`SyncLoopHook`为串行同步执行，会按照先后顺序执行所有的回调。
如果执行某个回调时的出错，则提前结束，并抛出一个自定义的错误。
每个回调会循环执行多次直至返回`undefined`，然后开始执行下一个回调直至全部执行结束。

`call`方法返回结果为`undefined`。

### SyncWaterfallHook

`SyncWaterfallHook`为串行同步执行，会按照先后顺序执行所有的回调。
如果执行某个回调时出错，则提前结束，并抛出一个自定义的错误。
上一个回调的返回值作为参数传递给下一个回调，第一个回调的参数通过`call`传递。

`call`方法返回结果为最后一个回调的返回值。

### AsyncParallelHook

`AsyncParallelHook`为异步并行执行，会并发执行所有回调。

`call`方法返回一个`Promise`对象，结果为`undefined`。
如果执行某个回调时出错或返回状态为`rejected`，则最终的状态为`reject`一个自定义的错误。

### AsyncParallelBailHook

`AsyncParallelBailHook`为异步并行执行，会并发执行所有回调。

`call`方法返回一个`Promise`对象，结果为回调返回的第一个**非**`undefined`值或`rejected`的错误(会被包装为一个自定义的错误)。

### AsyncSeriesHook

`AsyncSeriesHook`为异步串行执行，会按照先后顺序执行所有的回调。
如果执行某个回调时出错或返回状态为`rejected`，则提前结束，且最终将`reject`一个自定义的错误。

`call`方法返回一个`Promise`对象，结果为`undefined`。

### AsyncSeriesBailHook

`AsyncSeriesBailHook`为异步串行执行，会按照先后顺序执行所有的回调。
如果执行某个回调时出错或返回状态为`rejected`，则提前结束，且最终将`reject`一个自定义的错误。
如果执行某个回调时的返回值不为`undefined`，则提前结束。

`call`方法返回一个`Promise`对象，结果为最后一个执行回调的返回值。

### AsyncSeriesLoopHook

`AsyncSeriesLoopHook`为异步串行执行，会按照先后顺序执行所有的回调。
如果执行某个回调时出错或返回状态为`rejected`，则提前结束，且最终将`reject`一个自定义的错误。
回调会循环执行多次直至返回`undefined`，然后开始执行下一个回调直至全部执行结束。

`call`方法返回一个`Promise`对象，结果为`undefined`。

### AsyncSeriesWaterfallHook

`AsyncSeriesWaterfallHook`为异步串行执行，会按照先后顺序执行所有的回调。
如果执行某个回调时出错或返回状态为`rejected`，则提前结束，且最终将`reject`一个自定义的错误。
上一个回调的返回值作为参数传递给下一个回调，第一个回调的参数通过`call`传递。

`call`方法返回一个`Promise`对象，结果为最后一个回调的返回值。

## 自定义错误

钩子执行出错时，会抛出一个自定义的错误，其类型为`HookError`，包含以下属性：

- message: string，错误信息
- type: string，错误引发类型
- hook: string，钩子名称
- receiver: string，接收者名称
- stack: string，原始错误堆栈
