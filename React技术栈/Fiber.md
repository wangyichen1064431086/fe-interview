V16 的新增功能 Fiber 机制。

解决的问题：
如果拥有一个很复杂的复合组件，改动了最上层组件的 state, 那么调用栈就会很长。调用栈过长，加上中间进行了复杂的操作，可能导致长时间阻塞主线程，带来不好的用户体验。

Fiber的原理：
Fiber 本质上是一个虚拟的堆栈帧。新的调度器会按照优先级自由调度这些帧。从而将之前的同步渲染变为异步渲染，在不影响体验的情况下去分段更新。

componentWillRecieveProps -> getDerivedStateFromProps

componentWillUpdate -> getSnapshotBeforeUpdate