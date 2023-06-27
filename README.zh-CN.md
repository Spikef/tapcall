# TapCall

一个简单的类似于 [tapable](https://github.com/webpack/tapable) 的钩子模块，对于 typescript 用户更加友好。

> [英文文档 | The English Document](./README.md)

## 安装

```bash
npm install tapcall
```

## 钩子类型

### SyncHook

`SyncHook`为串行同步执行，不关心事件处理函数的返回值，在触发事件之后，会按照事件注册的先后顺序执行所有的事件处理函数。

`call`方法返回一个数组，为所有事件处理函数的返回值集合。

### SyncBailHook

`SyncBailHook`同样为串行同步执行，如果事件处理函数执行时有一个返回值不为空（即返回值为 undefined），则跳过剩下未执行的事件处理函数（如类的名字，意义在于保险）。

`call`方法返回最后一个事件处理函数的返回值。

### SyncWaterfallHook

`SyncWaterfallHook`为串行同步执行，上一个事件处理函数的返回值作为参数传递给下一个事件处理函数，依次类推，正因如此，只有第一个事件处理函数的参数可以通过`call`传递，而`call`的返回值为最后一个事件处理函数的返回值。

`call`方法返回最后一个事件处理函数的返回值。

### AsyncParallelHook

`AsyncParallelHook`为异步并行执行，如果其中一个事件处理函数返回的`Promise`的状态为`rejected`，则最终的状态也是`rejected`。

`call`方法返回一个`Promise`对象，可以通过`.then`拿到所有事件处理函数的返回值集合。

### AsyncSeriesHook

`AsyncSeriesHook`为异步串行执行，如果其中一个事件处理函数返回的`Promise`的状态为`rejected`，则跳过剩下未执行的事件处理函数。这也是为什么没有`AsyncSeriesBailHook`的原因。

`call`方法返回一个`Promise`对象，可以通过`.then`拿到最后一个事件处理函数的返回值。

### AsyncSeriesWaterfallHook

`AsyncSeriesWaterfallHook`为异步 “串行” 执行的 “钩子”，上一个事件处理函数的返回值作为参数传递给下一个事件处理函数。

`call`方法返回一个`Promise`对象，可以通过`.then`拿到最后一个事件处理函数的返回值。
