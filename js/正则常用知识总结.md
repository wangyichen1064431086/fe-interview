## 一、JavaScript正则相关方法
str.match(regexp)与regexp.exec(str)功能类似。

str.search(regexp)与regexp.test(str)功能类似。

### 1. String.prototype.match()
检索匹配项，并返回匹配的第一个完整子串及其下捕获组捕获结果构成的数组(无g),或返回匹配的所有的完整子串(有g)

#### 语法
```js
str.match(regexp)
```

##### param:

- regexp: 一个正则表达式对象。如果传入一个非正则表达式对象，则会隐式地使用 new RegExp(obj) 将其转换为一个 RegExp 。

##### return：

- 如果正则表达式不包含g标志：会返回一个数组，数组的第一项是进行匹配完整的字符串，之后的项是用圆括号捕获的结果；数组还会包含一个 **index属性**，其值为匹配结果中的完整字符串在原字符串中的索引；数组还会包含一个 **input属性**, 其值为原字符串。***此时返回的结果和 regexp.exec()返回的结果是完全相同的。***

- 如果正则表达式包含g标志:会返回一个数组,包含所有匹配的完整子字符串，但不包含匹配的捕获组捕获结果;也没有index属性和Input属性。

- 如果提供了正则表达式，但是没有匹配到（无论是否带g）: 返回null

- 如果未提供任何参数，直接使用 match()： 返回一个包含空字符串的 Array ：[""]，同时该Array还包含index属性为0，input属性为原字符串 。

#### 示例1: 正则表达式不带g, 带有捕获组, 且只有一个完整匹配
```js
var str = 'For more information, see Chapter 3.4.5.1';
var reg = /see (chapter \d+(\.\d)*)/i;

var result = str.match(reg);

/* result：
[ 
  "see Chapter 3.4.5.1", 
  "Chapter 3.4.5.1", 
  ".1", 
  index: 22, 
  input: "For more information, see Chapter 3.4.5.1", groups: undefined
]
*/

// 'see Chapter 3.4.5.1' 是整个匹配。
// 'Chapter 3.4.5.1' 被'(chapter \d+(\.\d)*)'捕获。
// '.1' 是被'(\.\d)'捕获的最后一个值。
// 'index' 属性(22) 是整个匹配从零开始的索引。
// 'input' 属性是被解析的原始字符串。
```

#### 示例2：正则表达式带g， 带有捕获组， 且只有一个完整匹配

```js
var str = 'For more information, see Chapter 3.4.5.1';
var reg = /see (chapter \d+(\.\d)*)/ig;

var result = str.match(reg);

/* result:

[
  "see Chapter 3.4.5.1"
]
*/
```

#### 示例3：正则表达式带g, 不带捕获组，有多个完整匹配

```js
var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var regexp = /[A-E]/gi;
var result = str.match(regexp);

/* result:
["A", "B", "C", "D", "E", "a", "b", "c", "d", "e"]
*/
```

#### 示例4：正则表达式带g, 带有捕获组，有多个完整匹配

```js
var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var regexp = /A(BCD)*/gi;
var result = str.match(regexp);

/* result:
["ABCD", "abcd"]
*/
```

#### 示例5： 不传参数
```js
var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

var result = str.match();

/* result:
[
  "", 
  index: 0, 
  input: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 
  groups: undefined
  ]
*/
```

### 2. RegExp.prototype.exec()
在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 null。并会更新正则表达式对象的属性。

#### 语法

```js
regExp.exec(str)
```

##### param
- str:要匹配正则表达式的字符串

##### return

- 如果匹配成功：会返回一个数组，数组的第一项是进行匹配完整的字符串，之后的项是用圆括号捕获的结果；数组还会包含一个 **index属性**，其值为匹配结果中的完整字符串在原字符串中的索引；数组还会包含一个 **input属性**, 其值为原字符串。

- 如果匹配失败：exec() 方法返回 null。


***返回的结果和 str.match(regexp) 中regexp不带有g时的返回的结果是完全相同的。***

###### 对正则表达式对象属性的更新
对原正则表达式对象做了以下属性的更新:

- lastIndex:	下一次匹配开始的位置。就是匹配的完整字符串之后的下一个字符的索引。**当正则对象含有 "g" 时，可以在同一个正则对象上多次执行 exec 方法来查找同一个字符串中的多个成功匹配。查找将从正则表达式的 lastIndex 属性指定的位置开始。**
- ignoreCase： 是否使用了 "i" 标记使正则匹配忽略大小写
- global：是否使用了 "g" 标记来进行全局的匹配.
- multiline：
是否使用了 "m" 标记使正则工作在多行模式（也就是，^ 和 $ 可以匹配字符串中每一行的开始和结束（行是由 \n 或 \r 分割的），而不只是整个输入字符串的最开始和最末尾处。）
- source：正则表达式的字符串（不含igm标记）

#### 示例1

```js
var regexp = /quick\s(brown).+?(jumps)/ig;
var str = 'The Quick Brown Fox Jumps Over The Lazy Dog, quick brown jumps';
var result1 = regexp.exec(str);

/* result1:
[
  "Quick Brown Fox Jumps", 
  "Brown", 
  "Jumps", 
  index: 4, 
  input: "The Quick Brown Fox Jumps Over The Lazy Dog, quick brown jumps", 
  groups: undefined
]
*/

// regexp:
regexp.lastIndex;//25 (即Jumps后面的那个空格符)
regexp.ignoreCase;//true
regexp.global;//true
regexp.multiline;//false
regexp.source;//"quick\s(brown).+?(jumps)"


var result2 = regex.exec(str);

//result2:
/*
 [
  "quick brown jumps", 
  "brown", 
  "jumps", 
  index: 45, 
  input: "The Quick Brown Fox Jumps Over The Lazy Dog, quick brown jumps", 
  groups: undefined
]
*/

//regexp:
regexp.lastIndex;//62
regexp.ignoreCase;//true
regexp.global;//true
regexp.multiline;//false
regexp.source;//"quick\s(brown).+?(jumps)"

```

### 3. String.prototype.search()
执行正则表达式和字符串之间的一个搜索匹配。返回字符串中首次完整匹配的索引或-1。

#### 语法

```js
str.search(regexp)
```

##### param
- regexp: 一个正则表达式对象。如果传入一个非正则表达式对象，则会使用 new RegExp(obj) 隐式地将其转换为正则表达式对象。

##### return
- 如果匹配成功：返回正则表达式在字符串中首次完整匹配的索引。
- 如果匹配失败：返回 -1。

#### 示例1：

```js
var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var regexp = /A(BCD)*/gi;
str.search(regexp); //0
```


### 4. RegExp.prototype.test()
执行一个检索，用来查看正则表达式与指定的字符串是否匹配。返回 true 或 false。

#### 语法

```js
regexp.test(str)
```

##### param
- str: 用来与正则表达式匹配的字符串

##### return

Type Boolean.如果正则表达式与指定的字符串匹配 ，返回true；否则false。

### 5. String.prototype.replace
返回一个由替换值替换一些或所有匹配的模式后的新字符串。模式可以是一个字符串或者一个正则表达式, 替换值可以是一个字符串或者一个每次匹配都要调用的函数。***原字符串不改变***

#### 语法

```js
str.replace(regexp|substr, newSubStr|function)
```

##### params
- pattern:
  - regexp: 一个RegExp对象或者RegExp字面量。该正则所匹配的内容会被第二个参数的返回值替换掉。
  - substr: 一个字符串。其会被第二个参数的返回值替换掉，**由于该substr是被视为一个字符串而非正则，所以仅仅是第一个匹配会被替换**。
- replacement:
  - newSubStr: 用于替换掉第一个参数在原字符串中的匹配部分的字符串。该字符串中可以内插一些特殊的变量名。
  - function: 一个用来创建新子字符串的函数，该函数的返回值将替换掉第一个参数匹配到的结果。

newSubStr中可以插入的特殊变量名:

变量名 | 代表值
-------|------
$$     | '$'
$&     | 匹配的子串
$`     | 当前匹配的子串左边的内容
$'     | 当前匹配的子串右边的内容
$n     | n为正整数，如果replace()方法的第一个参数是regexp,则表示第n个捕获组的匹配结果  

function的参数：

变量名 |代表值
-------|-----
match	 |匹配的子串。（对应于上述的$&。）
p1,p2, ..|如果replace()方法的第一个参数是一个RegExp，则代表第n个捕获组的匹配结果。（对应于上述的$1，$2等。）
offset	|匹配到的子字符串在原字符串中的偏移量。（比如，如果原字符串是“abcd”，匹配到的子字符串是“bc”，那么这个参数将是1）
string	|被匹配的原字符串。  

##### return
匹配替换后的新字符串。***原字符串不变。***

#### 示例1：使用function替换正则匹配结果

```js
function replaceFunc(match, p1, p2, p3, offset, string) {
  return [p1, p2, p3].join('-');
}

var str = 'abc12345#$*%';
var result = str.replace(/([^\d]*)(\d*)([^\w]*)/, replaceFunc)//"abc-12345-#$*%"
```

#### 示例2： 替换带有g标志的正则
```js
var str = 'Apples are round, and apples are juicy.'; 
var result = str.replace(/apples/ig, 'oranges');//'oranges are round, and oranges are juicy'.
```

#### 示例3： 重组字符串中的多个子串
```js
var str = 'John Smith';
var result = str.replace(/(\w+)\s(\w+)/,'$2 and $1');//'Smith and John'
```

#### 示例4： 将华氏温度转换为对应摄氏温度
```js
function f2c(x)
{
  function convert(str, p1, offset, s)
  {
    return ((p1-32) * 5/9) + "C";
  }
  var s = String(x);
  var test = /(\d+(?:\.\d*)?)F\b/g;
  return s.replace(test, convert);
}
```

#### 示例5: 字符串去前后空格 ***经典！& 常用！***
```js
str.replace(/^\s+|\s+$/g, "");
```

## 二、常用匹配字符
### 1.字符类别
字符 | 含义
-----|----
.    |匹配任意单个字符，除了\n \r \u2028或\u2029
\d   |匹配任意阿拉伯数字。等价于[0-9]
\D   |匹配任意不是阿拉伯数字的字符。等价于[^0-9]
\w   |匹配任意数字字母下划线。等价于[A-Za-z0-9_]
\W   |匹配任意不是数字字母下划线的字符。等价于[^A-Za-z0-9]
\s **生疏**  |匹配一个空白符，包括空格、制表符、换页符、换行符、回车符合其他Unicode空格。等价于[ \t\f\n\r\v\u00a0等等]
\S   |匹配一个非空白符
\t	 |匹配一个水平制表符（tab）
\r	 |匹配一个回车符（carriage return）
\n	 |匹配一个换行符（linefeed）
\v	 |匹配一个垂直制表符（vertical tab）
\f	 |匹配一个换页符（form-feed）
[\b] |匹配一个退格符（backspace）（不要与 \b 混淆）

### 2. 边界
字符 |含义
-----|----
^    |匹配输入开始。当有m标志时，将开始和结束字符（^和$）视为在多行上工作（也就是，分别匹配每一行的开始和结束（由 \n 或 \r 分割），而不只是只匹配整个输入字符串的最开始和最末尾处
$    |匹配输入结尾。 当有m标志时，将开始和结束字符（^和$）视为在多行上工作（也就是，分别匹配每一行的开始和结束（由 \n 或 \r 分割），而不只是只匹配整个输入字符串的最开始和最末尾处
\b  |匹配一个零宽单词边界，如一个字母和一个空格之间。（不要和 [\b] 混淆）。例如，/\bno/ 匹配 "at noon" 中的 "no"，/ly\b/ 匹配 "possibly yesterday." 中的 "ly"。**可以理解为就是单词边界**
\B  |匹配一个零宽非单词边界，如两个字母之间或两个空格之间。例如， /\Bon/匹配'at noon'中的'on, /ye\B/匹配'possibly yesterday'中的ye。**可以理解为单词中间**

### 3. 断言
字符 | 含义
-----|-----
x(?=y) **生疏**|仅匹配被y跟随的x。y可以是任意的正则字符组合。
x(?!y) **生疏**|仅匹配不被y跟随的x。y可以是任意的正则字符组合。例如，举个例子，/\d+(?!\.)/ 只会匹配不被点（.）跟随的数字。

## 三. 验证常用正则表达式

### 1. 邮箱

简化版：
```s
 /\S+@\S+\.\S+/
```

复杂版：
```s
/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
```

### 2. 用户名
用户名正则，4到16位（字母，数字，下划线，减号）
```s
/^[a-zA-Z0-9_-]{4,16}$/
```

### 3. 满足一定强度的密码
最少6位，至少包括1个大写字母、1个小写字母、1个数字、1个特殊字符：

```s
/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?]).*$/
```

检查某密码是否满足该强度:
```js
var pattern=/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?]).*$/;
pattern.test('Ftc0615!#%^')//true
```

### 4. 手机号码正则

```s
/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
```
通用版：
```s
/^\d{11}$/
```

### 5. 身份证号正则

```s
/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
```

## 四、分组与捕获括号
括号分为 **捕获分组括号**，和 **仅用于分组的非捕获型括号**两种。

### 1.捕获/分组括号:(...)
普通的无特殊意义的括号通常有两种功能：分组和捕获。

捕获型括号的编号是按照 **开括号**的次序，从左到右计算的。

如果提供了反向引用，则这些括号内的子表达式匹配的文本可以在表达式的后面部分使用$1、$2来引用。


### 2.仅用于分组的括号/非捕获型括号:(?:...)
仅用于分组的括号不能用来提取文本，而只能用来规定多选结构或者量词的作用对象。

它们不会按照$1、$2编号。

Example:
```s
    (1|one)(?:and|or)(2|two)
```
这样匹配之后，$1包含'1'或'one',$2包含'2'或'two'

## 参考资料
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/match>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/search>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace>

<https://www.jb51.net/article/115170.htm>

《精通正则表达式》