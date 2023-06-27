# TapCall

A simple [tapable](https://github.com/webpack/tapable) like hook module for plugins, which is friendly for typescript user.

> [中文文档 | The Chinese Document](./README.zh-CN.md)

## Installation

```bash
npm install tapcall
```

## Hook Types

### SyncHook

`SyncHook` is synchronous and serial, it doesn't care about the return value of the event handler, after the event is triggered, all event handlers will be executed in the order in which the events are registered.

The `call` method returns an array of return values for all event handlers.

### SyncBailHook

`SyncBailHook` is synchronous and serial, if one of the event handlers returns a non-empty value (i.e. the return value is undefined), the remaining event handlers will be skipped (such as the name of the class, the meaning is insurance).

The `call` method returns the return value of the last event handler.

### SyncWaterfallHook

`SyncWaterfallHook` is synchronous and serial, the return value of the previous event handler is passed as a parameter to the next event handler, and so on. Because of this, only the parameters of the first event handler can be passed through `call`, and the return value of `call` is the return value of the last event handler.

The `call` method returns the return value of the last event handler.

### AsyncParallelHook

`AsyncParallelHook` is asynchronous and parallel, if one of the event handlers returns a `Promise` whose status is `rejected`, the final status is also `rejected`.

The `call` method returns a `Promise` object, and you can get the return value set of all event handlers through `.then`.

### AsyncSeriesHook

`AsyncSeriesHook` is asynchronous and serial, if one of the event handlers returns a `Promise` whose status is `rejected`, the remaining event handlers will be skipped. This is also the reason why there is no `AsyncSeriesBailHook`.

The `call` method returns a `Promise` object, and you can get the return value of the last event handler through `.then`.

### AsyncSeriesWaterfallHook

`AsyncSeriesWaterfallHook` is an asynchronous "serial" execution "hook", the return value of the previous event handler is passed as a parameter to the next event handler.

The `call` method returns a `Promise` object, and you can get the return value of the last event handler through `.then`.
