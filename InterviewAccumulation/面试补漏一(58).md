## 一、rem与em的区别
### 相对字体大小单位
#### rem ***考点***
代表根元素的font-size大小（如html元素的font-size）.

当用在根元素上面时，它代表了它的初始值：
- 默认的初始值是html默认的font-size大小，即当未在根元素上设置font-size大小的时候，此时1rem == 1em;
- 当设置font-size为2em，就使得页面中1rem的大小相对于html根字体默认大小的2倍。

当用在其他元素上时，可以设置各种长度:
- 在根元素font-size = 10px的时候:1rem为10px, 2rem为20px, 0.5rem为5px;
- 在根元素font-size = 20px的时候:1rem为20px, 2rem为40px,0.5rem为10px ；

该单位在实际使用中一般用于创建完美的可扩展布局。例如移动端布局。

#### em ***考点***
代表元素font-size大小的计算值。
- 当定义font-size属性时，1em等于元素的父元素的字体大小；
- 如果在网页中任何地方都没有设置文字大小的话，那它将等于浏览器默认文字大小，通常是16px。所以通常1em = 16px。2em = 32px；
- 如果你设置了body元素的字体大小为20px，那为后代元素设置1em = 20px、2em = 40px。

实践示例：一个流行的技巧是设置body元素的字体大小为0.625em(即默认大小16px的62.5%)，等于10px。现在你可以通过计算基准大小10px的倍数，在任何元素上方便的使用em单位。这样有6px为0.6em, 8px 为0.8em, 12px为1.2em, 14px为1.4em, 16px为1.6em。

#### ex
代表元素font的x-height。在含有“X”字母的字体中，它是该字体的小写字母的高度；对于很多字体， 1ex ≈ 0.5em。

#### ch
代表元素所用字体 font中“0”这一字形的宽度（“0”，Unicode字符U+0030），或更准确地说是“0”这一字形的预测尺寸。

#### lh
代表元素行高line-height的计算值。

#### rlh
代表根元素行高line-height的计算值。当用于设置根元素的行高line-height或是字体大小font-size 时，该rlh指的是根元素行高line-height或字体大小font-size 的初始值。

### 绝对长度单位
#### px
与显示设备相关：
- 对于屏幕显示，通常是一个设备像素（点）的显示；
- 对于打印机和高分辨率的屏幕，一个 **CSS像素**意味着多个**设备像素** 

> 注意：设备中每英寸的CSS像素数量保持在96左右

#### in, pt， pc, mm, cm
- in: 英寸（2.54厘米）
- pt: 磅/点，1/72英寸
- pc: 12点活字，1pc为12pt
- mm: 毫米
- cm: 厘米

CSS单位和每英寸点数(DPI):
- CSS单位不是根据物理上的英寸来表现的，而是表现为96dpi,即无论真实的设备像素是多少，在1英寸的设备尺寸上都会有96个CSS像素（1in == 96px)。
- 在一个 **高像素密度的设备中，1in 会小于实际的 1 物理英寸**。类似地 mm、cm 和 pt 都不是一个绝对的长度单位。

例如:

- 1in总等于96px
- 3pt总等于4px 1pt = 1/72in = 1/72 * 96 px = 4/3 px
- 25.4mm总等于96px 25.4mm = 1in = 96px;
- 1pc总等于12pt等于16px 1pc = 12pt = 12 * 4/3 px = 15pt

### 参考
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/length>
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-size>

## 二、setTimeout(func,0)的实际最小延迟时间
HTML5规定setTimeout()的最短时间间隔是 **4ms**

## 三、es6的generator
生成器对象是由generator function返回。

和promise一样，都用于异步编程。

### 语法
```js
function* gen() {
  let a = 1 + 2；
  yield 2;
  yield 3;
}

let b = gen();
console.log(b.next());//{value:2, done:false}
console.log(b.next());//{value:3, done:false}
console.log(b.next());//{value:undefined, done:true}
```

#### *
表示这是一个generator函数，当加上了*的函数执行之后拥有了next函数。

#### yield关键字

用来暂停和恢复一个生成器函数。yield关键字后面的表达式的值返回给生成器的调用者。它可以被认为是 **一个基于生成器的版本的return关键字**。生成器函数执行时（gen().next()）一旦遇到yield表达式，生成器的代码将会暂停运行;直到再次调用next(),生成器会恢复执行。

每次调用next()方法时，生成器都会恢复执行，直到到达以下某个值:
- yield:生成器再次暂停并返回生成器生成的新值:{value:xxx, done:false}
- 到达生成器的结尾:生成器执行结束，并且返回{value:undefined,done:true}
- 到达return语句:生成器执行结束，并且返回{value:return值，done:false}

yield后面可以接promise用于返回一个异步的值。

### 用例: npm包co的用法
co:使用promises为nodejs和浏览器提供基于生成器的控制流程，让你以一种很好的方式编写非阻塞代码。
```js
var co = require('co');
 
co(function *(){
  // yield any promise
  var result = yield Promise.resolve(true);
}).catch(onerror);
 
co(function *(){
  // resolve multiple promises in parallel
  var a = Promise.resolve(1);
  var b = Promise.resolve(2);
  var c = Promise.resolve(3);
  var res = yield [a, b, c];
  console.log(res);
  // => [1, 2, 3]
}).catch(onerror);
```

其实它是模拟实现了后面的async,await

### 参考:
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterator>

## 四、tree shaking与import的形式
基于ES6的静态引用，tree shaking 通过扫描所有es6的export,找出被import的内容并添加到最终代码中。webpack 的实现是把所有 import 标记为有使用/无使用两种，在后续压缩时进行区别处理。

### 问题:对于如下形式的export和import，webpack可以识别出只要a，不要b吗?
m:
```js
export {
  a,
  b
}
```

n:
```js
import {a} from './m.js'
```
答案，从语法层面是可以的，但目前的技术并不能实现只要a不要b。***已亲测，这个导入的还是有b***

### 更多
<https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651554785&idx=2&sn=c8224713a71c914bd278e95dfdf18cf3&chksm=80255420b752dd36c70f200ee67a394df4a7982a3a3ab09f55ed5b106b12fc03cf85f5d60d66&mpshare=1&scene=1&srcid=0823pq09kc1hzk8SnfkuC90p&pass_ticket=Sm5XBRYnwnLhYDniwso8sU%2FDpJyPjMVDWj9O4wG4q5Iueu%2BnEMW8kzR0HWZKks8r#rd>

## 五、思考如下两种方式，require与import都导入两次同样的代码端，各输出几次'test'?
### 方式1：
m.js
```js
console.log('test');
function a() {
  ....
}
import default a;
```
n.js
```js
import a from './m.js';
export default a;
```
o.js
```js
import a1 from './m.js';
import a2 from './n.js';

a1();
a2();
```
这种情况只输出1次'test'，已亲测！！！

### 方式2：

m.js
```js
console.log('test');
function a() {

}
module.exports = a
```
o.js
```js
const a1 = require('./m.js');
const a2 = require('./m.js');
a1();
a2();
```
也是只输出1次'test',已亲测！！！ ***面试官误***

## 六、webpack的loader执行顺序
同时命中一个规则的话逆序执行loader。

loader和plugin 是先loader后plugin。

### 其他webpack考点：
参考:<http://www.fly63.com/article/detial/582>


#### (1) 什么是webpack和grunt和gulp有什么不同?
webpack是一个模块化打包器。
它的一个突出特点是code-spliting,代码分裂

#### (2)什么是bundle,chunck,module?
bundle:打包好的一个结果文件

chunk：entry下可以有多个chunck，每个chunk可以包含多个要打包的文件，最终每个chunk会生成一个bundle。output的filename如果设置为'[name].js'，则可以以每个chunk名称作为每个bundle的名字。(当然如果plugin里面有一些相关插件可以分裂除其中的一些代码，比如说把css分裂出去叫[name].css)

module:指开发中的不同模块，在配置文件中module.rules是一个数组，决定了如何处理项目中的不同类型的模块。

#### (3)什么是loader？什么是plubin?
loaders告诉webpack如何转换不同类型的模块

plugin是用来自定义webpack打包过程的方式，这些插件的方法参与到整个webpack打包的各个流程(生命周期)，在loaders后执行，针对的是loaders转化好的所有文件。按照顺序执行。

#### (4)如何可以自动生成webpack配置？
webpack-cli等工具

#### (5)webpack-dev-server和http服务器如nginx有什么区别?
答案：webpack-dev-server使用内存来存储webpack开发环境下的打包文件，并且可以使用模块热更新，他比传统的http服务对开发更加简单高效。

使用koa的时候通常用到koa-webpack,webpack-dev-middleware和webpack-hot-middleware来实现webpack-dev-server的功能。

#### (6)什么 是模块热更新？
模块热更新是webpack的一个功能，他可以使得代码修改过后不用刷新浏览器就可以更新，是高级版的自动刷新浏览器。

#### (7)什么是长缓存？在webpack中如何做到长缓存优化？
浏览器在用户访问页面的时候，为了加快加载速度，会对用户访问的静态资源进行存储，但是每一次代码升级或是更新，都需要浏览器去下载新的代码。

避免方式最方便和简单的更新方式就是引入新的文件名称。在webpack中可以在output中输出的文件指定chunkhash即设置filename:[name].[hash].js,即设置并且分离经常更新的代码和框架代码。

#### (8)webpack怎么实现treeshaking
webpack 负责对代码进行标记，把 import & export 标记为 3 类：

- 所有 import 标记为 /* harmony import */
- 被使用过的 export 标记为 /* harmony export ([type]) */，其中 [type] 和 webpack 内部有关，可能是 binding, immutable 等等。
- 没被使用过的 import 标记为 /* unused harmony export [FuncName] */，其中 [FuncName] 为 export 的方法名称

之后在 Uglifyjs (或者其他类似的工具) 步骤进行代码精简，把没用的都删除。


## 七、防抖和节流
见我的博客《防抖与节流》
