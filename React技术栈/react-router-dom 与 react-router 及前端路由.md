## react-router 与 react-dom-router 的区别
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