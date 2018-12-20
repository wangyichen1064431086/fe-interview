## 一、NodeList vs HTMLCollection
### 1.NodeList

NodeList是一个 **节点**的集合, 是由 Node.childNodes 和 document.querySelectorAll 返回的。

#### 特点
##### (1) 类数组
它是一种类数组对象，用于保存一组有序的节点，可以通过位置(childNodes[index]或childNodes.item(index)) 来访问这些节点, 但它 **并不是Array实例**。 

##### (2)有时实时有时静态

- childNodes是实时的。
- querySelectorAll是静态的。

#### 用例

基本用法:

```js
var firstChild = someNode.childNodes[0];
var secondChild = someNode.childNodes.item(1);
var thirdChild = someNode.childNodes.item('#id');
var nodeCount = someNode.childNodes.length;
```

将nodeList转化为Array：

```js
var nodeListArr = Array.prototype.slice.call(someNode.childNodes,0);
//es6
var nodeListArr = Array.from(someNode.childNodes);
```

###  2. HTMLCollection

HTMLCollection 接口表示一个包含了 **元素**（元素顺序为文档流中的顺序）的通用集合（generic collection）

以下集合为HTMLCollection:

- document.anchors:文档中所有带name属性的a元素
- document.forms:文档中所有form元素。同document.getElementsByTagName('form')
- document.images:文档中所有img元素。同document.getElementsByTagName('img')
- document.links:文档中所有带href的a元素。
- document.getElementsByTagName('*')
#### 用例
文档中有一个form元素，id为'myForm'。

```js
document.forms//是一个HTMLCollection

//获取该form的方法有以下4种
document.forms[0]
document.forms.item(0)

document.forms['myForm']
document.forms.namedItem('myForm');

document.images;  // This is an HTMLCollection


```

参考 <https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCollection>
###  3.NodeList与HTMLCollection比较



HTMLCollection与NodeList都是DOM节点的集合，两者都属于Collections范畴，二者的共同点有:

- 都是类数组对象，都有length属性
- 都有共同的方法：item，可以通过item(index)或者item(id)来访问返回结果中的元素
- 都是实时变动的（live），document上的更改会反映到相关对象上（例外：document.querySelectorAll返回的NodeList不是实时的）

两者的区别在于：

- 方法略有差异：HTMLCollection比NodeList多了一个namedItem方法，其他方法保持一致
- 包含节点类型不同：NodeList可以包含任何节点类型(Node)，HTMLCollection只包含元素节点（ElementNode）

## 二、parentNode vs parentElement
### 1. Node.parentNode


返回指定的节点在DOM树中的父节点.

parentNode是指定节点的父节点.该节点的父节点可能是一个元素(Element )节点,也可能是一个文档(Document )节点,或者是个文档碎片(DocumentFragment)节点.


### 2. Node.parentElement

返回当前节点的父 **元素节点**,如果该元素没有父节点,或者父节点不是一个元素节点.则 返回null.

### 3. parentElement和parentNode的比较
<https://stackoverflow.com/questions/8685739/difference-between-dom-parentnode-and-parentelement>


大多数情况下，parentElement和parentNode是相同的。

唯一的不同是当节点的父节点不是element类型的时候，parentElemnt就是null了。
As an example:
```js
document.body.parentNode; // the <html> element
document.body.parentElement; // the <html> element

document.documentElement.parentNode; // #document
document.documentElement.parentElement; // null
```

html元素（document.documentElement)的父节点不是element类型而是document类型，故其parentElemnt是null。

## 三、 childNodes vs children

### 1. Node.childNodes

Node.childNodes 返回包含指定节点的子节点的集合(NodeList)，该集合为即时更新的集合（live collection）。


### 2. Node.children

<https://developer.mozilla.org/zh-CN/docs/Web/API/ParentNode/children>

ParentNode.children 是一个只读属性，返回 一个Node的子elements ，也是一个动态更新的 HTMLCollection。

### 3. Node.childNodes和Node.children的比较
Node.childNodes返回NodeList；Node.children返回HTMLCollection。更多细节参见一、NodeList vs HTMLCollection

## 四、Node.firstChild/lastChild vs Node.previousSibling/nextSibling
### 1. Node.firstChild/lastChild
Node.firstChild/lastChild只读属性返回节点的第一个/最后一个子节点，如果节点是无子节点，则都为null。

它们分别对应Node.childNodes的第一个后最后一个节点。即someNode.firstChild等于someNode.childNodes[0];someNode.lastChild等于someNode.childNodes[someNode.childNodes.length-1]

要注意fistChild和lastChild也 **可以是文本节点**。

>Tips:使用 document.write 语句插入的两个元素之间不会有空白。

#### 用例

```html
<p id="para-01">
  <span>First span</span>
</p>

<script type="text/javascript">
  var p01 = document.getElementById('para-01'); 
  alert(p01.firstChild.nodeName)//#text 
</script>
```
上例得到的是文本节点，因为在p标签和span标签之前,有一个换行符和多个空格充当了一个文本节点.

```html
<p id="para-01"><span>First span</span></p>

<script type="text/javascript">
  var p01 = document.getElementById('para-01');
  alert(p01.firstChild.nodeName)
</script>
```
上例得到的是span元素节点。因为空白符已经被移除了。

### 2. Node.previousSibling/nextSibling
Node.previousSibling/nextSibling只读属性返回其前一个/后一个兄弟节点。即返回其父节点的childNodes列表中紧跟在该节点之前/之后的节点。

列表中第一个节点的previousSibling为null,最后一个节点的nextSibling为null。

如果列表中只有一个节点，则其previousSibling和nextSibling都为null

和Node.fistChild/lastChild一样，previousSibling和nextSibling也 **可以是文本节点**。


## 五. Node.appendChild() vs ParentNode.append()
### 1. Node.appendChild()
Node.appendChild() 方法将一个节点或fragment添加到指定父节点的子节点列表末尾，并返回添加的节点

> 注意:如果被插入的节点已经存在于当前文档的文档树中,则那个节点会首先 **从原先的位置移除**,然后再插入到新的位置.如果你需要保留这个子节点在原先位置的显示,则你需要先用 **Node.cloneNode** 方法复制出一个节点的副本,然后在插入到新位置.

#### 语法
```js
var child = node.appendChild(child);
```

### 2*. (实验中的功能) ParentNode.append()

ParentNode.append 方法在 ParentNode的最后一个子节点之后插入一组 Node 对象或 DOMString 对象。被插入的 DOMString 对象等价为 Text 节点。
 
### 3. Node.appendChild和 Node.appendChild() 的比较
 
- ParentNode.append() 允许你也追加  DOMString 对象，而 Node.appendChild() 只接受 Node 对象。
- ParentNode.append() 没有返回值，而 Node.appendChild() 返回追加的 Node 对象。
- ParentNode.append() 可以追加几个节点和字符串，而 Node.appendChild() 只能追加一个节点。

## 六. 其他节点操作办法

### 1. Node.insertBefore()
Node.insertBefore() 方法在参考节点之前插入一个节点作为一个指定父节点的子节点。

#### 语法
```js
var insertedElement = parentElement.insertBefore(newElement, referenceElement);
```

> 注意：如果referenceElement为null则newElement将被插入到子节点的末尾。

> 注意：如果newElement已经在DOM树中，newElement首先会从DOM树中移除

### 2. Node.replaceChild()
Node.replaceChild()方法用指定的节点替换当前节点的一个子节点，并返回被替换掉的节点。

#### 语法
```js
var replacedNode = parentNode.replaceChild(newChild, oldChild);
```
- newChild: 用来替换 oldChild 的新节点。如果该节点已经存在于DOM树中，则它会被从原始位置删除。
- oldChild: 被替换掉的原始节点。
- replacedNode 和oldChild相等。
### 3.Node.removeChild(childNode) & childNode.remove()

#### 思考：怎样移除一个DOM节点的所有子节点
```js
var el = document.getElementById('demo'); 
var childs = el.childNodes; 
for(var i = childs .length - 1; i >= 0; i--) {
  el.removeChild(childs[i]);
}
```

对比: ChildNode.remove() 方法把从它所属的DOM树中删除对象。


### 4. Node.cloneNode()
Node.cloneNode() 方法返回调用该方法的节点的一个副本。其有一个Boolean参数，表示是否执行深复制。

#### 语法
```js
var dupNode = node.cloneNode(deep);
```

- node:将要被克隆的节点
- dupNode:克隆生成的副本节点
- deep: TYPE Boolean， 可选， 默认为false执行浅复制。是否采用深度克隆,如果为true,则该节点的所有后代节点也都会被克隆,如果为false,则只克隆该节点本身.

#### 用例
Eg: 一个节点要想添加到两个父节点后面，这个节点必须要深复制一次：

```js
const switchStyle = document.createElement("style");
const switchStyleCopy = switchStyle.cloneNode(true);//深复制

innerIframeWindowHead.appendChild(switchStyle);
outerIframeWindowHead.appendChild(switchStyleCopy);
```

## 七. Element.innerHTML vs innterText vs textContent
### 1. Element.innerHTML
Element.innerHTML 属性设置或获取HTML语法表示的元素的后代。

- 在读模式下，**不同浏览器返回的文本格式会有不同**。IE和Opera会将所有标签转换为大写形式；Safari、Chrome、Firefox会按照原文档中的格式返回HTML,包括空格和缩进。
- 在写模式下，innerHTML值中所有标签都会按照浏览器处理HTML的标准模式转换为元素，**转换结果也因浏览器而异**。
- 在写模式下，如果设置的值仅仅是文本而无HTML标签，那么结果就是设置纯文本。
- 在大多数浏览器中，通过innerHTML插入的\<script> 元素 **并不会执行其中的脚本**.
- 大多数浏览器支持通过innerHTML插入\<style> 元素。
- 并不是所有元素都支持innerHTML。不支持的元素包括:col、colgroup、frameset、head、html、style、table、tbody、thead、tfoot、tr。

### 2. Node.innerText
innerText属性可以操作元素中所含的所有文本内容，包括子文档树中的文本：

- 在读模式下，它会按照由浅入深的顺序，将子文档树中的所有文本拼接起来
- 在写模式下，会删除元素的所有子节点，插入包含相应文本值的文本节点。

#### 用例
对于以下HTML：
```html
<div id="content">
  <p>This is a paragraph.</p>
  <ul>
    <li>Item1</li>
    <li>Item2</li>
  </ul>
</div>
```
执行以下js：
```js
document.getElementById("content").innerText;
/* 得到
This is a paragraph.
Item1
Item2
*/
```

#### 浏览器兼容性：
- 支持innerText的浏览器：IE、Safari、Opera、Chrome.
- 不支持innerText的浏览器: Firefox (但支持作用类似的textContent属性)

### 3. Node.textContent
Node.textContent 属性表示一个节点及其后代的文本内容。

#### 浏览器兼容性
- 支持的浏览器：除Firefox外，其他浏览器也都支持。

### 4. innerText和textContent的比较
- textContent 会获取所有元素的内容，包括 \<script> 和 \<style> 元素，然而 innerText 不会。
- innerText 受 CSS 样式的影响，并且不会返回隐藏元素的文本，而textContent会。
- 由于 innerText 受 CSS 样式的影响，它会触发重排（reflow），但textContent 不会。
- 与 textContent 不同的是, 对于小于等于 IE11 的版本中对 innerText 进行修改， 不仅会移除当前元素的子节点，而且还会永久性地破坏所有后代文本节点（所以不可能再次将节点再次插入到任何其他元素或同一元素中）

### 5. innerHTML和textContent的比较
- innerHTML 返回 HTML，为了在元素中检索或写入文本人们使用innerHTML；但textContent通常具有更好的性能，因为文本不会被解析为HTML。
- 使用textContent可以防止XSS攻击。

P294/301


## 七、延伸话题: 使用innerHTML的内存占用问题和效率问题
P297

### 1. 内存占用问题

使用innerHTML/outerHMTL/insertAjacentHTML可能带来性能问题。

在删除带有事件处理程序或将其他js对象作为属性的DOM子树时，可能导致内存占用问题。因为在删除时，元素与事件处理程序（或js对象）之间的绑定关系在内存中并没有一并删除。如果这种情况频繁出现，占用的内存数量就会明显增加。所以，在使用这些方法时，最好 **先手工删除要被替换的元素的所有事件处理程序和Js对象属性**。

### 2. 效率问题
插入大量HTML标记时，使用innerHTML比使用createElement再appendChild、insertBefore要高效得多。因为设置innerHTML时会创建一个HTML解析器，该解析器是在浏览器级别代码(C++)基础上运行的，故比执行JavaScript快得多。

但是创建和销毁HTMl解析器也会带来性能损失，所以最好 **将设置innerHTML的次数控制在合理范围之内**。例如将要插入的HTML字符串完全拼接好了，再一次性插入DOM。


## 参考资料
<https://developer.mozilla.org/zh-CN/docs/Web/API/Node/parentNode>
<https://developer.mozilla.org/zh-CN/docs/Web/API/Node/parentElement>
<https://developer.mozilla.org/zh-CN/docs/Web/API/ParentNode/append>
<https://developer.mozilla.org/zh-CN/docs/Web/API/Node/textContent>

<https://www.jianshu.com/p/f6ff5ebe45fd>
<http://blog.csdn.net/jjfat/article/details/9127509>

《JavaScript高级程序设计》10.1.1、11.3.6、11.4.4

