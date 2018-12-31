## 四伪类分别介绍

### 1. :link
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/:link>
#### 匹配简介
选中元素当中的链接。它将会选中所有尚未访问的链接，包括那些已经给定了其他伪类选择器的链接
#### 优先级
为了可以正确地渲染链接元素的样式，:link伪类选择器应当放在其他伪类选择器的前面。

### 2. :visited
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/:visited>
#### 匹配简介
匹配已经访问过的链接。
#### 优先级
应该放在:link之后，:hover、:active之前。

### 3.:hover
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/:hover>
#### 匹配简介
适用于用户使用指示设备虚指一个元素（没有激活它）的情况。
#### 优先级
为了确保生效，:hover规则需要放在:link和:visited规则之后，但是在:active规则之前

### 4. :active
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/:active>
#### 匹配简介
匹配被用户激活的元素。它让页面能在浏览器监测到激活时给出反馈。当用鼠标交互时，它代表的是用户按下按键和松开按键之间的时间。

通常用于但并不限于 < a> 和 < button> HTML元素

#### 优先级
这个样式可能会被后声明的其他链接相关的伪类覆盖，这些伪类包括 :link，:hover和 :visited。为了正常加上样式，需要把 :active的样式放在所有链接相关的样式后

## LVHA顺序
LVHA的循顺序声明:link－:visited－:hover－:active。

## 使用元素
用过的有a, li 等。

## 用例
```css
a:link {color: slategray;}
a:visited { color: #4b2f89; }
```

## 其他用途
### 1. 使用:hover 伪类创建一个纯CSS的下拉按钮（不使用JavaScript）。 
本质是创建如下的CSS：
```
div.menu-bar ul ul {
  display: none;
}

div.menu-bar li:hover > ul {
  display: block;
}
```