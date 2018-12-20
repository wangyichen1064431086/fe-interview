## 一、css动画相关的几个属性

属性|含义|理解
----|----|---
transform| 一种CSS属性。用于修改CSS视觉格式模型的坐标空间。使用它，元素可以被移动（translate）、旋转（rotate）、缩放（scale）、倾斜（skew）。 |变形
translate()| CSS属性transform的一种可能值。用于移动元素。|平移的变形
transition|一种CSS属性。用于设置过渡样式。为一个元素在不同状态之间切换的时候定义过渡效果。比如在一个元素的不同的伪类之间切换，像是 :hover ，:active 或者通过JavaScript实现的状态变化。|过渡
animation|一种CSS属性。用于设置动画。是一个简写的属性，包含6个属性。|动画


## 二、transform

### 1. 语法
```css

transform: matrix(1,2,3,4,5,6);
transform: translate(120px, 50%);
transform；scale(2, 0.5);
transform: rotate(0.5);
transform: skew(30deg, 20deg);
transform: scale(0.5) translate(-100%, -100%)

```

浏览器兼容前缀:
Chrome/Safari|Firefox|IE|Opera
------|-------|--|-----
-webkit|-moz|-ms|-o


### 2. 示例

```html

<style>
    p{
      width:200px;
      border: thin solid red;
      -webkit-transform: translate(200px, 200px);
      -moz-transform: translate(200px, 200px)
      transform: translate(200px, 200px) rotate(30deg);
    }
</style>

<p>啦啦啦</p>
```

### 3. 各变形方式说明
#### (1)translate
见下三、

#### (2)rotate

## 三、translate()
### 1.语法

```css
translate(tx) /* Equal to translateX(tx) */

translate(tx, ty)

translateX(tx)

translateY(ty)
```

param:

- tx,ty:水平、垂直方向的移动距离。可以为 绝对距离，也可以为百分数

注意：它必须写在transform属性里面！！

### 2. 示例
见一、


## 四、transition

### 1.语法
它是一个简写属性。等于:

```s
<transition-property> <transition-duration> <transition-timing-function> <transition-delay>
```
必不可少的是: 

```s
<transition-property> <transition-duration>
```

```css
transition: margin-right 2s;
transition: margin-right 2s .5s;
transition: margin-right 2s ease-in-out;
transition: margin-right 2s ease-in-out .5s;
transition: margin-right 2s, color 1s;
```

Transitions可以为一个元素在不同状态之间切换的时候定义不同的过渡效果。比如在不同的伪元素之间切换，像是 :hover ，:active 或者通过JavaScript实现的状态变化。

>注意:transform属性只对block级元素生效！

### 2.示例

```html
 <style>
    p{
      width:200px;
      border: thin solid red;
      font-size: 16px;
    }
    p:hover{
      border: thick solid green;
      font-size: 32px;
      transition: border 2s, font-size 1s;

    }
  </style>

  <p>啦啦啦</p>
```

## 五、animation
### 1. 语法
它是一个简写属性，等于:

```s
<animation-name> <animation-duration> <animation-timing-function> <animation-delay> <animation-iteration-count> <animation-direction> <animation-fill-mode>
```
各属性详细解释如下表：

属性|作用
----|-----
name|用来调用@keyframes定义好的动画，与@keyframes定义的动画名称一致
duration|指定元素播放动画所持续的时间
timing-function|规定速度效果的速度曲线，是针对每一个小动画所在时间范围的变换速率
delay|定义在浏览器开始执行动画之前等待的时间，是整个animation执行之前等待的时间
iteration-count|定义动画的播放次数，可选具体次数或者无限(infinite)
direction|设置动画播放方向：normal(按时间轴顺序),reverse(时间轴反方向运行),alternate(轮流，即来回往复进行),alternate-reverse(动画先反运行再正方向运行，并持续交替运行)
fill-mode|控制动画结束后，元素的样式，有四个值：none(回到动画没开始时的状态)，forwards(动画结束后动画停留在结束状态)，backwords(动画回到第一帧的状态)，both(根据animation-direction轮流应用forwards和backwards规则)，注意与iteration-count不要冲突(动画执行无限次)

```css

  animation: 3s ease-in 1s 2 reverse both paused slidein;
            /*  duration | timing-function | delay | iteration-count | direction | fill-mode | play-state | name */

  animation: 3s linear 1s slidein;
            /* duration | timing-function | delay | name */

  animation: 3s slidein;
            /* @ duration | name */

```

### 2.示例
```html

 <style>
    .lala {
      width:200px;
      border: thin solid red;
      margin-left: 10px;
      font-size: 16px;
      animation: mymove 4s linear 0s infinite;
      -webkit-animation: mymove 4s linear 0s infinite;
      -moz-animation: mymove 4s linear 0s infinite;
      -o-animation: mymove 4s linear 0s infinite;
    }

    @-webkit-keyframes mymove {
      from {
        margin-left: 0;
        background:yellow;
      }

      to {
        margin-left:100%;
        background: green;
      }
    }
    @-moz-keyframes mymove {
      from {
        margin-left: 0;
        background:yellow;
      }

      to {
        margin-left:100%;
        background: green;
      }
    }
    @-o-keyframes mymove {
      from {
        margin-left: 0;
        background:yellow;
      }

      to {
        margin-left:100%;
        background: green;
      }
    }
    @keyframes mymove {
      from {
        margin-left: 0;
        background:yellow;
      }

      to {
        margin-left:100%;
        background: green;
      }
    }
  </style>

  <p class="lala">啦啦啦</p>

```

### 3.思考动画带来的重排和重绘
以上示例使用margin-left或者left会造成重排，性能会降低。

使用translate和translate3d都是解决方案。

### translate
不会引起重排，只会引起重绘。
Eg:修改后代码如下：
```html
<style>
    .lala {
      width:200px;
      border: thin solid red;
      font-size: 16px;
      animation: mymove 4s linear 0s infinite;
      -webkit-animation: mymove 4s linear 0s infinite;
      -moz-animation: mymove 4s linear 0s infinite;
      -o-animation: mymove 4s linear 0s infinite;
    }

    @-webkit-keyframes mymove {
      from {
        transform:translate(0px);/*或translateX(0px)*/
        background:yellow;
      }

      to {
        transform:translate(100%);/*或translateX(0px)*/
        background: green;
      }
    }
    @-moz-keyframes mymove {
      from {
        transform: translate(0px);
        background:yellow;
      }

      to {
        transform:translate(100%);
        background: green;
      }
    }
    @-o-keyframes mymove {
      from {
        transform: translate(0px);
        background:yellow;
      }

      to {
        transform:translate(100%);
        background: green;
      }
    }
    @keyframes mymove {
      from {
        transform: translate(0px);
        background:yellow;
      }

      to {
        transform:translate(100%);
        background: green;
      }
    }
  </style>
  <p class="lala">啦啦啦</p>
```
###  translate3d()
应用transform: translate3d(x,y,z)会生成新图层。
对于需要频繁渲染的元素建议单独生成一个新图层，这样可以提高性能。但也不能生成过多的图层，会有反作用。

Eg:使用translate3d修改代码后如下:
```html
<style>
    .lala {
      width:200px;
      border: thin solid red;
      font-size: 16px;
      animation: mymove 4s linear 0s infinite;
      -webkit-animation: mymove 4s linear 0s infinite;
      -moz-animation: mymove 4s linear 0s infinite;
      -o-animation: mymove 4s linear 0s infinite;
    }

    @-webkit-keyframes mymove {
      from {
        transform: translate3d(0, 0, 0);
         background:yellow;
      }

      to {
        transform:translate3d(100%,0,0);/*或translateX(0px)*/
        background: green;
      }
    }
    @-moz-keyframes mymove {
      from {
        transform: translate3d(0, 0, 0);
        background:yellow;
      }

      to {
        transform: translate3d(100%,0,0);
        background: green;
      }
    }
    @-o-keyframes mymove {
      from {
        transform: translate3d(0, 0, 0);
        background:yellow;
      }

      to {
        transform: translate3d(100%,0,0);
        background: green;
      }
    }
    @keyframes mymove {
      from {
        transform: translate3d(0, 0, 0);
        background:yellow;
      }

      to {
        transform: translate3d(100%,0,0);
        background: green;
      }
    }
  </style>
  <p class="lala">啦啦啦</p>
```

translate(100%,0) 是相对于自身的尺寸非父元素
## 参考资料
<https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651554407&idx=2&sn=4e07eeb18ba07031cfe89ad03e34ecea&chksm=802555a6b752dcb0ecb0075ab696b62b52c46ca67dfdb9912b758303d2f3edcb30f36a1c7a19&mpshare=1&scene=1&srcid=0619jmh5bLao0U7Lq6j4qwg0#rd>

<https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform>
<https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate>
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition>
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions>
<https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation>