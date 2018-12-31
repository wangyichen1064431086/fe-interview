## 一、meta元素概述
HTML meta元素表示那些不能由其它HTML元相关元素 (< base>, < link>, < script>, < style> 或 < title>) 之一表示的任何元数据信息.

## 二、meta属性
### 1. charset
声明当前文档所有的字符编码。鼓励使用utf-8。

```html
<meta charset="utf-8">
```

### 2. http-equiv
定义了能改变服务器和用户引擎行为的编译。这个编译值使用content来定义。


#### (1)X-UA-Compatible
在IE8刚推出的时候，很多网页由于重构的问题，无法适应较高级的IE8浏览器，所以使用X-UA-Compatible强制IE8采用低版本方式渲染。 

以下代码指定IE用IE7模式渲染：
```html
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />

```

以下代码指定IE用Edge模式渲染：Edge 模式告诉 IE 以最高级模式渲染文档，也就是任何 IE 版本都以当前版本所支持的最高级标准模式渲染，避免版本升级造成的影响。简单的说，就是什么版本 IE 就用什么版本的标准模式渲染。**FTC和MDN都采用的是这种模式**
```html
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```

使用以下代码强制 IE 使用 Chrome Frame 渲染:
```html
<meta http-equiv="X-UA-Compatible" content="chrome=1">
```

#### (2) content-language
定义页面使用的默认语言。已过时，用html元素上的全局属性lang替代：

```html
<html lang="zh-CN">
```
### 3. name
此属性定义文档级元数据的名称。如果还设置了一个属性名为itemprop，http-equiv或charset，则不应使用name属性设置它。

此文档级元数据名称与content属性所包含的值相关联。名称元素的可能值与其相关联的值通过content属性存储。

#### （1） viewport
提供了关于视口初始大小的提示，该指令仅有一些移动设备使用

content的内容:

value名称|可能值|描述
--------|------|---
width   |一个正整数或者字符串 device-width|以pixels（像素）为单位， 定义viewport（视口）的宽度。
height  |一个正整数或者字符串 device-height|	以pixels（像素）为单位， 定义viewport（视口）的高度。
initial-scale|一个0.0 到10.0之间的正数|定义设备宽度（纵向模式下的设备宽度或横向模式下的设备高度）与视口大小之间的缩放比率。值越大字越放大，看到的面积越小。
maximum-scale|一个0.0 到10.0之间的正数|定义缩放的最大值；它必须大于或等于minimum-scale的值，不然会导致不确定的行为发生。
minimum-scale|一个0.0 到10.0之间的正数|定义缩放的最小值；它必须小于或等于maximum-scale的值，不然会导致不确定的行为发生。
user-scalable|yes或no|默认为yes。如果设置为 no，用户将不能放大或缩小网页。

FTC和MDN的viewport设置:
```html
<meta name="viewport" content="width=device-width,initial-scale=1">
```

##### More tips about viewport
参考<https://www.zybuluo.com/gongzhen/note/170557>

目前能总结出如下几点：

- width=device-width与initial-scale=1效果等价

#### （2）robots
定义协作爬虫与页面应具有的行为。 它是以逗号分隔的值列表。通用的有以下几种：

value|描述
-----|----
index |允许爬虫机器人索引本页面
noindex|不允许爬虫机器人索引本页面
follow |允许爬虫机器人跟踪本页面上的链接
nofollow|不允许爬虫机器人跟踪本页面上的链接

MDN的robots设置:

```html
<meta name="robots" content="index, follow">
```

#### (3)author，
本文档的作者名称，可以用自由的格式去定义

#### (4)description
其中包含页面内容的简短和精确的描述。 一些浏览器，如Firefox和Opera，将其用作书签页面的默认描述。


## 三*、引申:itemprop数据
与meta无关，但可以对比学习。

<https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/itemprop>

## 参考资料
<https://developer.mozilla.org/zh-CN/docs/learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML>
<https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta>
<https://www.zybuluo.com/gongzhen/note/170557>