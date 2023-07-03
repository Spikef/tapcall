import SyncHook from './hooks/sync-hook';
import SyncBailHook from './hooks/sync-bail-hook';
import SyncLoopHook from 'tapcall/hooks/sync-loop-hook';
import SyncWaterfallHook from './hooks/sync-waterfall-hook';
import AsyncParallelHook from './hooks/async-parallel-hook';
import AsyncParallelBailHook from './hooks/async-parallel-bail-hook';
import AsyncSeriesHook from './hooks/async-series-hook';
import AsyncSeriesWaterfallHook from './hooks/async-series-waterfall-hook';

export {
  SyncHook,
  SyncBailHook,
  SyncLoopHook,
  SyncWaterfallHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesWaterfallHook,
};
