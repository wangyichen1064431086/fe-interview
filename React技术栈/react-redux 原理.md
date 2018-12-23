## react-redux 思想
Redux 和 React 之间没有关系。 要在 React 的项目中使用 Redux，比较好的方式是借助 react-redux 这个库来做连接。

react-redux 是基于 容器组件和展示组件相分离 的开发思想。

不同点：

  ||展示组件|容器组件
 --|-------|-------
作用 |	描述如何展现（骨架、样式）|描述如何运行（数据获取、状态更新）
直接使用 Redux|否|是
数据来源	 | props| 监听 Redux state
数据修改	|从 props 调用回调函数	|向 Redux 派发 actions
调用方式	|手动	|通常由 React Redux 生成

大部分的组件都应该是展示型的，但一般需要少数的几个容器组件把它们和 Redux store 连接起来。

react-redux提供两个关键模块：Provider和connect。

## API 解析
### Provider
它可以使组件层级中的 connect() 方法都能获得 Redux store。正常情况下，你的根组件应该嵌套在 <Provider > 中，其下的组件才能使用 connect() 方法。

Provider 这个模块是作为整个 App 的容器，在你原有的 App Container的基础上再包上一层，它的工作很简单，就是接受 Redux 的 store 作为props，并将其声明为 context 的属性之一，子组件可以在声明了contextTypes 之后可以方便的通过 this.context.store 访问到store。不过我们的组件通常不需要这么做，将 store 放在context里，是为了给下面的connect用的。

Eg:
```js
ReactDOM.render(
  <Provider store={store}>
    <MyRootComponent />
  </Provider>,
  rootEl
)
```

### connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
连接 React 组件与 Redux store。返回一个新的与 Redux store 连接的组件类（容器型组件）。

connect就是:
(1) 将store中的必要数据作为props传递给React组件。
(2) 包装action creator用于在响应用户操作时dispatch一个action, 就是把执行 dispatch (action creatore) 的方法作为 props 传递给 React 组件。

参数：
#### (1) **mapStateToProps** 
函数签名： (state, [ownProps]) => stateProps

在 store 中维护的 state 中选择一些合适的映射到组件的 props。

#### (2) **mapDispatchToProps**
函数签名：(dispatch, [ownProps]) => dispatchProps

## 示例
```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

// React component
class Counter extends Component {
    static propTypes = {
        value: PropTypes.number.isRequired,
        onIncreaseClick: PropTypes.func.isRequired
    }
    render() {
        const { value, onIncreaseClick } = this.props
        return (
            <div>
                <span>{value}</span>
                <button onClick={onIncreaseClick}>Increase</button>
            </div>
        )
    }
}

// Action
const increaseAction = {
    type: 'increase'
}

// Reducer
function counter(state = {count:0}, action) {
    const count = state.count
    switch (action.type) {
        case 'increase':
            return {count: count+1 }
        default:
            return state
    }
}

// Store
const store = createStore(counter)

// Map redux state to component props
function mapStateToProps(state) {
    return {
        value: state.count
    }
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
    return {
        onIncreaseClick: () => dispatch(increaseAction)
    }
}

// Connect Component
const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

```