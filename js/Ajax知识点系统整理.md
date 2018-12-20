# Ajax

## 一、javascript原生Ajax

### 1.简介

Ajax是Asynchronous JavaScript+XML(异步JavaScript和XML)的缩写。

该名称诞生于XML还是数据传输首选格式的时期，现在这种情况已经不复存在。尽管X在Ajax中代表XML, 但由于JSON的许多优势，比如更加轻量以及作为Javascript的一部分，目前 **JSON** 的使用比XML更加普遍。JSON和XML都被用于在Ajax模型中打包信息。

Ajax技术的核心是 **XMLHttpRequest对象** （简称XHR)。XHR为向服务器发送请求和解析服务器响应提供了流畅的接口。能够以异步方式从服务器取得更多信息，意味着用户单击后，不用刷新页面也能获得新数据。即可以使用XHR对象取得新数据，然后通过DOM将新数据插入到页面中。

**Ajax的好处：**

1. 可以异步生成请求，用户可以在表单被处理时继续与文档交互。而传统提交表单发送到服务器，用户必须等待服务器处理数据并生成响应。
2. 响应信息可以仅更新页面的一部分。而传统提交表单到服务器后，整个页面被刷新，所有上下文信息都丢失了。

**XMLHttpRequest对象的特点：**

1. XMLHttpRequest对象可以接受任何数据类型而不仅仅为XML
2. 它支持的协议类型包括不限于http(还包括file,ftp)

### 2.XMLHttpRequest的API

#### xhr.onreadystatechange

只要xhr.readyState的值改变一次，就会触发一次readystatechange事件。所以可以利用该事件来检测readyState发生变化后的值。

***readystatechange事件处理程序只能通过xhr.onreadystatechange（DOM0级法法）来绑定才能确保跨浏览器的兼容性，因为并非所有浏览器都支持DOM2级方法***

#### xhr.readyState

请求/响应过程的当前活动阶段。该属性可能的值为：

- 0：未初始化。尚未调用open()方法。
- 1: 启动。已经调用open()，但尚未调用send()。
- 2: 发送。已经调用send()，但尚未收到响应。
- 3: 接收。已经接收到部分响应数据。
- 4：完成。已经接收到全部响应数据，而且已经可以在客户端使用了。

#### xhr.status

响应的HTTP状态码。通常是将 200<= 状态码 <300 或 status为304作为响应成功的标志。

***Tips***: 304表示请求的资源并没有被修改，可以直接使用浏览器缓存中的版本，所以也意味着响应有效。

#### xhr.statusText

HTTP状态的说明文字。

#### xhr.responseText

作为响应主体被返回的文本。

#### xhr.open()

初始化一个请求。

参数:

- method:请求所使用的HTTP方法; 例如 "GET", "POST", "PUT", "DELETE"等

- url:该请求要访问的url。可以是绝对地址，也可以是相对于执行代码的当前页面的相对地址。

- async:布尔值，是否异步发送请求，默认为true

- user(可选):用户名,为授权使用;默认为空string.

- password(可选):密码,可选参数,为授权使用;默认为空string.

***注意：*** 调用该方法并不会真正发送请求，只是启动一个请求以备发送。

#### xhr.send()

发送请求. 如果该请求是异步模式(默认),该方法会立刻返回. 相反,如果请求是同步模式,则直到请求的响应完全接受以后,该方法才会返回.

参数：

- 请求主体发送的数据。***如果不需要请求主体发送数据，如GET请求，那么必须传入null,因为该参数对于有些浏览器是必需的。***

#### xhr.abort()

如果请求已经被发送，则立刻终止请求。

调用这个方法后，XHR对象会停止触发事件readystatechange,也不再允许访问任何与响应有关的对象属性。

#### xhr.setRequestHeader()

默认会发送的请求头有:

- Accept:浏览器能够处理的内容类型
- Accept-Charset:浏览器能够显示的字符集
- Accept-Encoding:浏览器能够处理的压缩编码
- Accept-language:浏览器当前设置的语言
- Connection:浏览器与服务器之间连接的类型(通常为keep-alive,即网络连接就是持久的，使得对同一个服务器的请求可以继续在该连接上完成。)
- Cookie:当前页面设置的任何cookie
- Host:发出请求的页面所在的域
- Referer:发出请求的页面的URI. 即表示当前页面是通过此来源页面里的链接进入的。服务端一般使用 Referer 首部识别访问来源，可能会以此进行统计分析、日志记录以及缓存优化等。
- User-Agent:浏览器用户代理字符串

该方法会设置自定义的请求头部信息。

参数:

- header: 将要被赋值的请求头名称。
- value: 给指定的请求头赋的值。

使用示例:

```js
xhr.setRequestHeader("Content-Type","application/json");
```
#### xhr.getResponseHeader()

获取相应响应头字段的信息。

参数：

- header:要获取的响应头的值的名称

#### xhr.getAllResponseHeaders()

取得包含所有响应头部信息的长字符串。

#### new FormData()

XMLHttpRequest level2级接口。

FormData为序列化表单以及创建与表单格式相同的数据(用于XHR传输)提供了便利。

可以这样向FormData构造函数传入表单元素来填入键值对：

```js
var data = new FormData(document.forms[0]);
```

也可以使用append方法添加任意多个键值对:

```js
var data = new FormData();
data.append('name', 'Bonnie');
```

FormData对应数据的"Content-Type"为"multipart/form-data"，这也是该表头的默认值，故使用FormData可以不必明确为Content-Type设置值，这是它的方便之处。

### 3. 使用范例：GET请求

#### 写法步骤:

1. 创建XMLHttpRequest对象:var xhr=new XMLHttpRequest() 
2. 指定xhr.onreadystatechange事件监听函数，在函数中先检测readyState属性（表示请求/响应的阶段）为4（表完成），再检测相应状态(xhr.status>=200&&xhr.status<300)||xhr.status==304) ，再在页面指定地方接受xhr.responseText(响应返回的文本）
3. 执行xhr.open("GET"，URL,是否异步）
4. xhr.send(null)

#### 实例:

```html
<div>
    <button id="btn">Apples</button>
</div>
<div id="target">
</div>
<script>
  var button=document.getElementById("btn");
  button.onclick=handleButtonPress;
  
  function handleButtonPress(e) {
    var xhr=new XMLHttpRequest();//创建XMLHttpRequest对象

    xhr.onreadystatechange=function(){
      if (xhr.readyState==4) {//xhr.readyState:该属性表示请求/响应过程的当前活动阶段，4为完成，其值每变化一次都会触发一次readystatechange事件
        if ((xhr.status>=200&&xhr.status<300)||xhr.status==304) {//xhr.status：响应的状态
        //304状态码:客户端已经执行了GET,但文件未发生变化，即服务器如果发现资源没有改变过，那么就会返回304，告诉浏览器，我没变过，你去读缓存吧，于是浏览器也不用从服务器拉数据了
            document.getElementById("target").innerHTML=xhr.responseText;//xhr.responseText：作为响应主体被返回的文本
        }
        else{
            document.getElementById("target").innerHTML="Request was unsuccessful: "+xhr.status;
        }
      }
    }

    xhr.open("GET","example.html",true);//要发送的类型、请求的URL和是否异步发送
    xhr.send(null);//发送作为请求主体要发送的数据 
  }
</script>

```

***Tips***:GET请求经常会发生查询字符串格式有问题的错误。解决方法：查询字符串中每个参数的名称和值都必须使用encodeURIComponent()进行编码。以下是一个向URL末尾添加查询字符串参数的方法:

```js
  function addUrlParam(url, name, value) {
    url += url.indexOf('?') === -1 ? '?' : '&';
    url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
  }
```

### 3. 使用范例：POST请求（发送json数据)

#### 写法步骤

1. 处理提交按钮默认行为：如果提交按钮button没有设置type="button",那么其默认type为submit,要先调用e.preventDefault()取消按钮提交表单的默认行为。
2. 准备好POST数据：通过DOM获取表单数据，并将其转换为Object类型,再用JSON.stringify转换为json字符串。
3. 创建XMLHttpRequest实例：var xhr=new XMLHttpRequest() 
4. 指定xhr.onreadystatechange事件处理函数：在函数中先检测readyState属性为4，再检测相应状态(xhr.status>=200&&xhr.status<300)||xhr.status==304) ，再处理请求的响应文本xhr.responseText。如果得到的响应文本也是json字符串，那么也需要用JSON.parse方法将其从JSON字符串解析为Object。
5. xhr.open("POST"，URL,是否异步）。
6. 设置请求头字段：xhr.setRequestHeader("Content-Type","application/json")设置请求头段Content-Type为application/json,告诉服务器在发送json数据。
7. xhr.send(2.中准备好的json字符串)

#### 实例：

```html
  <form id="fruitform" method="post" action="localhost:3000/form">
    <p>Bsnanas:</p>
    <p><input name="bananas" value="2"/></p>
    <p>Apples:</p>
    <p><input name="apples" value="5"/></p>
    <p>Cherries:</p>
    <p><input name="cherries" value="20"/></p>

    <p>Total:</p>
    <div id="results">0 items</div>
    <button id="submit" type="submit">Submit Form</button>
</form>

<script>
  document.getElementById("submit").onclick=handleButtonPress;
  function handleButtonPress(e) {
    e.preventDefault();//取消按钮提交表单的默认行为
    var form=document.getElementById("fruitform");

    var formData=new Object();
    var inputElements=document.getElementsByTagName("input");
    for (var i=0;i<inputElements.length;i++) {
        formData[inputElements[i].name]=inputElements[i].value;
    }//将表单提交的数据转换为object类型

    var xhr=new XMLHttpRequest();//创建XMLHttpRequest()对象
    xhr.onreadystatechange= function(){//为xhr.onreadystatechange设置事件监听函数，readystatechange改变的时候触发
      if (xhr.readyState==4) {
        if (xhr.status>=200&&xhr.status<300||xhr.status==304) {
          var data=JSON.parse(xhr.responseText);//把JSON数据解析为对象
          document.getElementById("results").innerHTML="You ordered "+data.total+" items";
        }
      }
    }
    xhr.open("post",form.action,true);//xhr.open()设置post方法，发送到的URL，是否异步
    xhr.setRequestHeader("Content-Type","application/json");//设置请求的首部字段Content-Type为application/json,告诉服务器在发送json数据
    xhr.send(JSON.stringify(formData));//浏览器向服务器发送数据前，要把数据从Object转换为JSON字符串
  }
</script>
```

### 4. 使用范例：POST请求(发送表单默认格式数据)

#### 写法步骤:

1. 处理提交按钮默认行为：如果提交按钮button没有设置type="button",那么其默认type为submit,要先调用e.preventDefault()取消按钮提交表单的默认行为。
2. 准备好POST数据：通过DOM获取表单数据，并将其处理为字符串"name1=value1&name2=value2...namen=valuen&"。
3. 创建XMLHttpRequest实例：var xhr=new XMLHttpRequest() 
4. 指定xhr.onreadystatechange事件处理函数：在函数中先检测readyState属性为4，再检测相应状态(xhr.status>=200&&xhr.status<300)||xhr.status==304) ，再处理请求的响应文本xhr.responseText。
5. xhr.open("POST"，URL,是否异步）。
6. 设置请求头字段：xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),告诉服务器在发送x-www-form-urlencoded数据。
7. xhr.send(2.中准备好的字符串)。

#### 实例:

```html
<script>
  document.getElementById("submit").onclick=handleButtonPress;
  
  function handleButtonPress(e) {
    e.preventDefault();//取消按钮提交表单的默认行为
    var form=document.getElementById("fruitform");
   
    var formData="";
    var inputElements=document.getElementsByTagName("input");
    for (var i=0;i<inputElements.length;i++) {
        formData+=inputElements[i].name+"="+inputElements[i].value+"&";
    }//将表单提交的数据转换为编码表单数据的默认方式（application/x-www-form-urlencoded编码）。

    var xhr=new XMLHttpRequest();//创建XMLHttpRequest()对象
    xhr.onreadystatechange=function() {//为xhr.onreadystatechange设置事件监听函数，readystatechange改变的时候触发
      if(xhr.readyState == 4) {
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status==304) {
          document.getElementById("results").innerHTML = xhr.responseText;
        }
      }
    }
    xhr.open("post",form.action,true);//xhr.open()设置post方法，发送到的URL，是否异步
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");//设置请求的首部字段Content-Type为application/json,告诉服务器在发送json数据
    xhr.send(formData);//浏览器向服务器发送数据前，要把数据从Object转换为JSON字符串
  }
</script>
```

### 5. 使用范例：POST请求(发送FormData数据)

```js
var data = new FormData(document.forms[0]);//可以这样向FormData构造函数传入表单元素来填入键值对
/*也可以使用append方法添加任意多个键值对。
var data = new FormData();
data.append('name', 'Bonnie');
*/
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
      console.log(xhr.responseText)
    }
  }
}
xhr.open('POST', 'post.php', true);
xhr.send(data);
```

## 二、jQuery的$.ajax()

<http://api.jquery.com/jQuery.ajax/>

### 1. 简介

执行Ajax请求。

### 2. 用例

#### （1）POST请求

```js

$.ajax({
  method: 'POST',
  url:'example.php',
  data: {
    name: 'Bonnie',
    age: 26
  },
  dataType:'json'
}).done(function(msg){
  console.log(msg);
})
```

#### (2)请求的三种回调函数

```js
$.ajax('example.php')
  .done(function(){
    alert('success');
  })
  .fail(function() {
    alert('error');
  })
  .always(function() {
    alert('complete')
  })
```

### 3.API

#### $.ajax(url[, settings])

##### url

请求的地址。

##### settings

这里列出一些重点配置属性：

###### contentType 

default 'application/x-www-form-urlencoded; charset=UTF-8')

告诉服务器发送的数据类型。

###### crossDomain

default: false for same-domain requests, true for cross-domain requests)

是否跨域

###### data

Type: object or string or array)

要发送到服务器的数据。

###### dataType

default: Intelligent Guess (xml, json, script, or html)

Type: String

The type of data that you're expecting back from the server. If none is specified, jQuery will try to infer it based on the MIME type of the response (an XML MIME type will yield XML, in 1.4 JSON will yield a JavaScript object, in 1.4 script will execute the script, and anything else will be returned as a string）

dataTye字段指明你期望从服务器返回的数据类型，如果没有指定值，那么jQuery将尝试根据response的MIME类型来推断该数据类型（XML MIME类型将产生XML， 1.4版本的JSON将产生JavaScript对象，1.4版本的script将产生script，其他类型将返回字符串）

***实践中遇到的问题:***

- 如果服务端php不指定header类型，那么response数据默认分配成text/html；此时，若客户端ajax不指定dataType，则在done里接收的data为string类型，这样还需要JSON.parse对其进行处理

- 如果服务端php指定header类型为application/json，那么response的数据类型就为JSON字符串;此时，若客户端ajax不指定dataType，则在done里接收的data就为JavaScript object类型，这样就不需要通过JSON.parse对其进行处理。

#### jqXHR.done(function(data, textStatus, jqXHR){})

请求成功的回调函数

#### jqXHR.fail(function(jqXHR, textStatus, errorThrown){})

请求错误的回调函数

#### jqXHR.always(funciton(ata | jqXHR，textStatus，jqXHR | errorThrown){})

请求成功和失败都会执行的回调函数。

## 三、ES6的Fetch

### 1.简介

Fetch API提供了一个获取资源的借口(包括跨域)。它提供了许多与XMLHttpRequest相同的功能，但被设计成更具可扩展性和高效性。

Fetch 的核心在于对 HTTP 接口的抽象，包括 Request，Response，Headers，Body，以及用于初始化异步请求的 global fetch。

[Service Workers]s(https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_APIs) 是大量使用Fetch的API的一个示例。

#### fetch()方法

它返回一个 **promise**,这个promise会在请求响应后被resolve,并传回Response对象。

当遇到网络错误时，fetch()返回的promise会被reject,并传回TypeError。

成功的fetch()检查不仅要包括promise被resolve,还要包括Response.ok属性为true.

#### fetch规范与jQuery.ajax()的不同:

- 当接收到一个代表错误的 HTTP 状态码时，从 fetch()返回的 Promise 不会被标记为 reject， 即使该 HTTP 响应的状态码是 404 或 500。相反，**它会将 Promise 状态标记为 resolve （但是会将 resolve 的返回值的 ok 属性设置为 false ）**，仅当网络故障时或请求被阻止时，才会标记为 reject。
- 默认情况下，fetch 不会从服务端发送或接收任何 cookies, 如果站点依赖于用户 session，则会导致未经认证的请求。**如果要发送 cookies，必须设置 credentials 选项**。

### 2.用例

#### (1)GET请求-获取json数据

```js
fetch(urlStr)
  .then( res => res.json()) //res是一个response对象，并不是我们期望的json结果。为了获取JSON内容，我们需要使用 json()方法。res.json()方法返回的也是一个promise对象，所以需要再一次地使用then()
  .then( myJson => {
    console.log(myJson)
  })
```

#### (2)用例：POST请求-发送json数据

```js
fetch(urlStr, {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  body: JSON.stringify(data),//需要和请求头字段Content-Type保持一致。这里是发送json字符串
  headers: {
    'content-type': 'application/json'
  },
  /* or:
  headers: new Headers({
    'Content-Type': 'application/json'
  })
  
  */
})
.then(res => res.json())
.catch(error => console.error('Error:', error))
.then(data => console.log(data))
```

加上对请求是否成功的验证:

```js
fetch(urlStr, {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  body: JSON.stringify(data),//需要和请求头字段Content-Type保持一致。这里是发送json字符串
  headers: {
    'content-type': 'application/json'
  },
})
.then(res => {
  if(res.ok) {
    return res.json();
  }
  throw new Error('Network response was not ok.');
 })
.catch(error => console.error('Error:', error.message))
.then(data => console.log(data))

```

### 3. API

#### (1) Body

Fetch API中的Body类代表Response/Request的body,允许你声明其内容类型是什么以及应该如何处理。

Body类由Response类和Request类实现，这为对象response和request提供了一个相关联的body（字节流）

##### 属性

###### Body.bodyUsed

只读：包含一个指示body是否被读取过的 Boolean 值。

##### 方法

###### Body.json()

使用一个 JSON 对象来读取 Response流中的数据，并将bodyUsed状态改为已使用。

返回：一个promise, resolve的结果是Json **对象** 而非字符串（即经过JSON.parse()解析过的JSON字符串)

###### Body.formdata()

使用一个 FormData 对象来读取 Response流中的数据，并将bodyUsed状态改为已使用。

返回: 一个 Promise，resolve的结果是FormData 对象。

###### Body.text()

使用一个USVString (文本) 对象来读取 Response流中的数据，并将bodyUsed状态改为已使用。

返回：一个包含USVString对象 (text)的Promise，resolve的结果的编码为UTF-8。

**注意：** 其与Body.json()方法的区别：同样是请求json字符串文本:

- 如果使用res.json(),那么resolve的结果直接是JavaScript对象（或数组）
- 如果使用res.text(),那么resolve的结果是json字符串，需要使用JSON.parse()才能得到JavaScript对象（或数组）

###### Body.arrayBuffer()

使用一个buffer数组来读取 Response流中的数据，并将bodyUsed状态改为已使用。

返回：A promise that resolves with an ArrayBuffer.

###### Body.blob()

使用一个Blob对象来读取Response流中的数据，并将bodyUsed状态改为已使用。

返回：A promise that resolves with a Blob.

####（2）Headers
Headers 接口允许您对HTTP请求和响应头执行各种操作。 这些操作包括检索，设置，添加和删除.

##### 构造函数
let myHeader = new Headers()

##### append()
给现有的header添加一个值, 或者添加一个未存在的header并赋值.

##### delete()
从Headers对象中删除指定header

##### Headers.get()
从Headers对象中返回指定header的第一个值.

#### (3)fetch方法的请求参数

```js
{
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  }
```

##### method
请求的方法

##### headers
请求头信息

##### mode
请求的模式：

- no-cors(default):该模式允许来自 CDN 的脚本、其他域的图片和其他一些跨域资源，但请求的 method 只能是HEAD、GET 或 POST。
- same-origin：禁止跨域。如果一个请求是跨域的，那么将返回一个 error，这样确保所有的请求遵守同源策略。
- cors：跨域请求。用来从第三方提供的 API 获取数据。该模式遵守 CORS 协议，并只有有限的一些 Header 被暴露给 Response 对象，但是 body 是可读的。



##### credentials
 请求的凭据 :

- omit: 从不发送cookies.
- same-origin: 只有当URL与响应脚本同源才发送 cookies、 HTTP Basic authentication 等验证信息.
- include: 不论是不是跨域的请求,总是发送请求资源域在本地的 cookies、 HTTP Basic authentication 等验证信息.

参见 <https://developer.mozilla.org/zh-CN/docs/Web/API/Request/credentials>

##### redirect
可用的重定向模式: follow (自动重定向), error (如果产生重定向将自动终止并且抛出一个错误), 或者 manual (手动处理重定向).

##### referrer
可以是 no-referrer、client或一个 URL ***待研究***


## 参考文档与资料

<https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX>
<https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest>

<http://api.jquery.com/jQuery.ajax/>

<https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API#>
<https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch>
<https://developer.mozilla.org/zh-CN/docs/Web/API/Body>
<https://developer.mozilla.org/zh-CN/docs/Web/API/Request>
<https://developer.mozilla.org/zh-CN/docs/Web/API/Response>
<https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/fetch>