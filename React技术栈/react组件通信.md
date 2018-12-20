### 1. 子组件向父组件传值
#### 思路
简单来说，就是父组件中定义了一个方法（funcA)，这个方法是（value1,value2...)=> {this.setState({})}。即可以通过一些参数值更新父组件的 state。

然后，这个 funcA 作为子组件的一个 props(propsB) 的值，即 <子组件 propsB = funcA />。

子组件进行一些操作时，如发生了 onClick 事件，那么此时 子组件执行 this.props.propsB(value1, value2,...) ，就是执行了父组件的方法 funcA。执行funcA, 父组件就获得了最新的 state 值。

#### 实践
父组件Header:
```js
import Nav from 'Nav.js';
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.callbackForNav = this.callbackForNav.bind(this);
  }
  callbackForNav({ selectedTopChannelOrder, selectedSubChannelOrder, selectedTopChannelName, selectedSubChannelName }) {
    this.setState({ 
      selectedTopChannelOrder, 
      selectedSubChannelOrder, 
      selectedTopChannelName, 
      selectedSubChannelName 
    })
  }
  render() {
    return (<Nav channels={navChannelData} dynamicnav={dynamicNav}  defaultSelectedTopChannelOrder={navDefaultTopOrder} defaultSelectedSubChannelOrder={navDefaultSubOrder} callbackFunc={this.callbackForNav} sticky="top" />)
  }
}
```

子组件Nav:
```js
class Nav extends React.Component {
  constructor() {
    this.state = {
      selectedTopChannelOrder:0, 
      selectedSubChannelOrder:-1,
      selectedTopChannelName: "", 
      selectedSubChannelName:""
    }
  }
  static propTypes = {
    callbackFunc: PropTypes.func
  }
  componentDidMount() {
    const {selectedTopChannelOrder, selectedSubChannelOrder, selectedTopChannelName, selectedSubChannelName} = this.state;
    this.props.callbackFunc({selectedTopChannelOrder, selectedSubChannelOrder, selectedTopChannelName, selectedSubChannelName}) 
  }
  clickSubChannel() {
     this.setState({
        selectedTopChannelOrder: topOrder,
        selectedTopChannelName: topName,
        selectedSubChannelOrder: subOrder,
        selectedSubChannelName: subName
    });
    this.props.callbackFunc({
        selectedTopChannelOrder: topOrder,
        selectedTopChannelName: topName,
        selectedSubChannelOrder: subOrder,
        selectedSubChannelName: subName
    });
  }

  render() {
    return (...)
  }
}
```
### 2. 跨级组件传值
#### 思路
利用context：
- 父组件设置 static childContextTypes 、 getChildContextTypes() => ({key:value})
- 子组件设置 static contextTypes，使用 数据 this.context.key

#### 实践
父组件:
```js
class List extends React.Component {
  static childContextTypes = {
    color:PropTypes.string
  }

  getChildContext() {
    return {
      color:'red'
    }
  }
  render() {
    return (...)
  }
}
```

子组件:
```js
class ListItem extends React.Component {
  static contextTypes = {
    color:PropTypes.string
  }

  render(){
    return (
      <li style={{background:this.context.color}}>someword</li>
    )
  }
}
```

### 3. 无嵌套关系的组件传值

```js
import {EventEmitter} from 'events';

const emitter = new EventEitter();

class A extends React.Component {
  clickHandler(data,e) {
    this.setState({
      ...
    });
    emitter.emit('theclick', data);
  }
  render() {
    const data = 'xxx';
    return (<div onClick={this.clickHandler.bind(this, data)} />)
  }
}

// 另一种写法
class A extends React.Component {
  clickHandler = (data,e) => {
    this.setState({
      ...
    });
    emitter.emit('theclick', data);
  }
  render() {
    const data = 'xxx';
    return (<div onClick={(e) => this.clickHandler(data, e)} />)
  }
}

```
App containing A and B:
```js
import {EventEmitter} from 'events';

const emitter = new EventEitter();

class App extends React.Component {
  componentDidMount() {
    this.listenerForTheClick = emitter.on('theclick', (data) => {
      this.setState({
        propForB: data;
      })
    })
  }
  componentWillUnmount() {
    emitter.remove(this.listenerForTheClick);
  }

  render() {
    return (
      <B someprop={this.state.propForB} />
      <A />
    )
  }
}

```