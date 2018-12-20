## 性能优化的思路
影响网页性能最大的因素是浏览器的重排(repaint)和重绘(reflow)。

React的Virtual DOM就是尽可能地减少浏览器的重排和重绘。

React的shouldComponentUpdate方法默认都返回true，即始终都会执行render方法，然后做virtual DOM比较，并得出是否需要做真实的DOM更新。这往往会带来许多不必要的渲染。如果shouldComponentUpdate返回false，那么就不再向下执行生命周期方法。

从React渲染过程来看，如何防止不必要的渲染是解决问题的关键。

## 性能优化的具体办法
### 1. 尽量多使用无状态函数构建组件
无状态组件只有props和context两个参数。它不存在state，没有生命周期方法，组件本身即有状态组件构建方法中的render方法。

在合适的情况下，都应该必须使用无状态组件。**无状态组件不会像React.createClass和ES6 class会在调用时创建新实例，它创建时始终保持了一个实例，避免了不必要的检查和内存分配，做到了内部优化。**

***但是由于无状态组件没有shouldComponentUpdate方法，它每次都会重新渲染 virtual DOM, 所以如果是频繁变化的组件应该是用无状态组件。如果组件不变的话，还是不要使用为好。***

### 2. 拆分组件为子组件，对组件做更细粒度的控制
#### 相关重要概念： 纯函数
纯函数的三大构成原则:
- 给定相同的输入，它总是返回相同的输出： 比如反例有 Math.random(), New Date()
- 过程没有副作用：即不能改变外部状态
- 没有额外的状态依赖：即方法内部的状态都只能在方法的生命周期内存活，这意味着不能在方法内使用共享的变量。

纯函数非常方便进行方法级别的测试及重构，它可以让程序具有良好的扩展性及适应性。纯函数是函数式编程的基础。

React组件本身就是纯函数，即传入指定props得到一定的Virtual DOM，整个过程都是可预测的。

#### 具体办法
拆分组件为子组件，对组件做更细粒度的控制。保持纯净状态，可以让方法或组件更加专注(focus)，体积更小(small)，更独立(independent)，更具有复用性(reusability)和可测试性(testability)。



### 3. 运用PureRender，对变更做出最少的渲染
#### 相关重要概念: PureRender
PureRender的Pure即是指满足纯函数的条件，即组件被相同的props和state渲染会得到相同的结果。

在React中实现PureRender需要重新实现shouldComponentUpdate生命周期方法。shouldComponentUpdate是一个特别的方法，它接收需要更新的props和state，其本质是用来进行正确的组件渲染。当其返回false的时候，不再向下执行生命周期方法；当其返回true时，继续向下执行。

组件在初始化过程中会渲染一个树状结构，当父节点props改变的时候，在理想情况下只需渲染一条链路上有关props改变的节点即可；但是，**在默认情况下shouldComponentUpdate方法返回true,React会重新渲染所有的节点**。

有一些官方插件实现了对shouldComponentUpdate的重写，然后自己也可以做一些代码的优化来运用PureRender。

#### 具体办法
##### (1) 运用PureRender
使用官方插件react-addons-pure-render-mixin实现对shouldComponentUpdate的重写
```js
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return <div className={this.props.className}>foo</div>
  }
}
```
它的原理是对object(包括props和state)做浅比较，即引用比较，非值比较。比如只用关注props中每一个是否全等(如果是prop是一个对象那就是只比较了地址，地址一样就算是一样了)，而不用深入比较。

手动实现该浅比较：
```js
function shallowEqual(obj, newObj) {
  if(obj === newObj) {
    retutn true
  }
  const objKeys = Object.keys(obj)
  const newObjKeys = Object.keys(newObj)
  if(objKeys.length !== newObjKeys.length) {
    return false
  }
  return objKeys.every(key => newObj[key] === obj[key])
}

function shouldComponentUpdate(nextProps, nextState){
  if(shallowEqual(this.props, nextProps) && shallowEqual(this.state, nextState)) {
    return false
  }
  return true
}
```
##### (2)优化PureRender
避免无论如何都会触发shouldComponentUpdate返回true的代码写法。

###### 避免直接为prop设置字面量的数组和对象
就算每次传入的数组或对象的值没有变，但它们的地址也发生了变化。

如以下写法每次渲染时style都是新对象都会触发shouldComponentUpdate为true:
```jsx
<Account style={{color: 'black'}} />
```
改进办法：将字面量设置为一个引用:
```js
const defaultStyle = {};
<Account style={this.props.style || defaultStyle} />
```

###### 避免每次都绑定事件
如果这样绑定事件的话每次都要生成一个新的onChange属性的值:
```js
render() {
  return <input onChange={this.handleChange.bind(this)} />
}
```

应该尽量在构造函数内进行绑定，如果绑定需要传参那么应该考虑抽象子组件或改变现有数据结构:
```js
constructor(props) {
  super(props);
  this.handleChange = this.handleChange.bind(this);
}
handleChange() {
  ...
}
render() {
  return <input onChange={this.handleChange} />
}
```

##### 在设置子组件的时候要在父组件级别重写shouldComponentUpdate

### 4.运用immutable
#### 相关重要概念: Immutable Data
##### Immutable Data概述
JavaScript中对象一般是可变的，因为使用引用赋值，新的对象的改变将影响原始对象。为了解决这个问题是使用深拷贝或者浅拷贝，但这样做又造成了CPU和内存的浪费。

Immutable data很好地解决了这个问题。

Immutable data就是一旦创建，就不能再更改的数据。对Immutable对象进行修改、添加或删除操作，都会返回一个新的Immutable对象。**Immutable实现的原理是持久化的数据结构。即使用旧数据创建新数据时，保证新旧数据同时可用且不变。同时为了避免深拷贝带来的性能损耗，Immutable使用了结构共享(structural sharing),即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其他节点则进行共享。**

Immutable.js库最重要的3种数据结构是:
- Map:键值对集合，对应于Object，ES6也有专门的Map对象
- List：有序可重复的列表，对应于Array
- ArraySet:无序且不可重复的列表

##### Immutable Data的优点:
- 降低了“可变”带来的复杂度；
- 节省内存: Immutable使用结构共享尽量复用内存，没有被引用的对象会被垃圾回收:
 ```js
  import Map from 'immutable';
  let a = Map({
    select:'users',
    filter: Map({name: 'Cam'})
  });
  let b=a.set('select', 'people');
  a === b; //false
  a.get('filter') === b.get('filter');//true
 ```
 a和b共享了没有变化的filter节点。
- 易于实现撤销/重做、赋值/粘贴这些功能：因为每次数据都是不一样的，只要把这些数据放到一个数组里存储起来，想退回到哪里就可以退回到哪里。
- 拥抱函数式编程: Immutable本来就是函数式编程中的概念。只要输入一样，输出必定一样

##### 使用Immutable Data比较对象：
两个Immutable对象可以使用===来比较，这样是直接比较内存地址，其性能最好。即使两个对象的值相等，也会返回false。（原生JS也是这样）
```js
let map1 = Immutable.Map({a:1, b:1, c:1});
let map2 = Immutable.Map({a:1, b:1, c:1});
map1 === map2;//false
```

如果要直接比较对象的值，可以用Immutable.is来做**值比较**：
```js
Immutable.is(map1, map2);
```
Immutable.is比较的是两个对象的hashCode或valueOf(对于JavaScript对象)。由于Immutable内部使用了trie数据结构(字典树，单词查找树)来存储，只要两个对象的hashCode相等值就是一样的。该算法避免了深度遍历比较，性能非常好。

#### 具体办法
上述方式3.pureRender中使用'react-addons-pure-render-mixin'库重写shouldComponentUpdate方法(引用比较)，也可以自己写一个方法进行引用比较。当然，也可以用深拷贝或者深比较，但是深拷贝和深比较都非常的昂贵。

使用Immutable.js的===和is方法来进行比较就能知道是否需要render,而且这个操作成本几乎为零，可以极大地提高性能。如下修改shouldComponentUpdate:

```js
import React from 'react';
import {is} from 'immutable';

class App extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const thisProps = this.props || {};
    const thisState = this.state || {};

    if (Object.keys(thisProps).length !== Object.keys(nextProps).length || Object.keys(thisState).length !== Object.keys(nextState).length) {
      return true;
    }

    for (const key in nextProps) {
      if (nextProps.hasOwnProperty(key) && !is(thisProps[key], nextProps[key])) {
        return true;
      }
    }

    for (const key in nextState) {
      if (nextState.hasOwnProperty(key) && !is(thisState[key],nextState[key])) {
        return true;
      }
    }

    return false;
  }
}
```