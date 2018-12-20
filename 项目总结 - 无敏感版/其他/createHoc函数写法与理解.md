```js
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

function createHoc(name, hoc) {
  return function wrap(WrappedComponent) {
    const Component = hoc(WrappedComponent)

    hoistNonReactStatics(Component, WrappedComponent) 
    // 将组件上的 static 方法从 WrappedComponent拷贝到 Component, 类似于 Object.assign()
    //详见 https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over
    //https://www.npmjs.com/package/hoist-non-react-statics
    Component.displayName = `${name}(${getDisplayName(WrappedComponent)})`

    return Component
  }
}
```