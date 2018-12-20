路由页面：

```jsx
<Switch>
<Route
    async
    path="/wechat/myresources/:app"
    component={() => import('./routes/MyResources')}
    />
</Switch>
```

因为是不同路由对应的是一个组件，那切换的话完全不会重新加载。组件中通过 this.props.match.params.app 来获取这个值，然后需要在 componentWillReceiveProps 中来去比较 nextprops 中的 app 和 之前的 app, 如果是不同的话，要再去进行数据请求。请求的方法的地址也是根据 app 来拼接的。

## react-router-dom 与 react-router 的区别
写法1：
```js
import {Switch, Route, Router, HashHistory, Link} from 'react-router-dom'
```

写法2：
```js
import {Switch, Route, Router} from 'react-router'
import {HashHistory, Link} from 'react-router-dom'

```

### react-router: 
实现了路由的核心功能
### react-router-dom: 
基于react-router，加入了在浏览器运行环境下的一些功能，例如：
- Link组件，会渲染一个a标签; 
- BrowserRouter 组件：使用pushState和popState事件构建路由
- HashRouter组件： 使用window.location.hash和hashchange事件构建路由。

## 前端路由的原理
本质就是监听 URL 的变化，然后匹配路由规则，显示相应的页面，并且无需刷新。

前端路由更多用在单页应用上, 也就是SPA。主要有两种方式：
- hash 模式： 通过监听 hashChange 事件
- history 模式： 使用 pushState 和 popState 事件构建路由



## 参考资料
<https://blog.csdn.net/weixin_37242696/article/details/80738392>