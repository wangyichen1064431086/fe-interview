## CORS
CORS是一个W3C标准，全称是”跨域资源共享”（Cross-origin resource sharing）。
它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。

CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。

对于前端而言，CORS 通信与同源的 AJAX 通信没有差别，代码几乎一样。**浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息**，有时还会多出一次附加的请求，但用户不会有感觉。

实现 CORS 的关键是服务器。只要服务器实现了 CORS 接口，就可以跨域通信。

## CORS 的两种请求
浏览器将CORS请求分成两类：
- 简单请求 simple request 
- 非简单请求not-so-simple request

### 什么是简单请求
满足一下两个条件的请求就是简单请求：
1. 请求方法是以下三种方法之一：
  - HEAD
  - GET
  - POST
2. HTTP的头信息不超出以下几种字段： 
  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

### 什么是 非简单请求
不满足以上两个条件的就是非简单请求。


## 浏览器对两种 CORS 请求的不同处理
> **浏览器对这两种请求的处理是不一样的。**

### 对简单请求的处理
浏览器发现这次跨源AJAX请求是简单请求，就 **自动在头信息之中添加一个Origin字段**, 直接发出 CORS 请求。

Origin字段用来说明：本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求：

如果Origin指定的源不在许可范围内：
  - 服务器会返回一个正常的HTTP回应
  - 浏览器发现这个回应的头信息没有包含Access-Control-Allow-Origin字段，就知道出错了，从而抛出一个错误，被XMLHttpRequest的onerror回调函数捕获。***注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200***。

如果Origin指定的域名在许可范围内：
  - 服务器返回的响应，会多出几个头信息字段:
    ```s
      Access-Control-Allow-Origin: http://api.bob.com
      Access-Control-Allow-Credentials: true
      Access-Control-Expose-Headers: FooBar
    ```

##### (1) Access-Control-Allow-Origin: 
该字段是必须的。它的值要么是请求时Origin字段的值;要么是一个*，表示接受任意域名的请求。

##### (2) Access-Control-Allow-Credentials:
该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。**设为true即表示服务器明确许可Cookie可以包含在请求中一起发给服务器**。这个值也只能设为true，如果服务器不要浏览器发送Cookie，删除该字段即可。另外，前端开发也必须在AJAX请求中打开withCredentials属性,否则，即使服务器同意发送Cookie，浏览器也不会发送:
```js
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
```

##### (3) Access-Control-Expose-Headers: 
该字段可选。**CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma**。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。


### 对非简单请求的处理
非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为”预检”请求（preflight）。

#### 预检请求
浏览器先询问服务器，**当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段**。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。

“预检”请求用的请求方法是OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是Origin，表示请求来自哪个源。

除 Origin 字段，预检请求头还包括以下两个特殊字段：

#####（1）Access-Control-Request-Method

该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法，如PUT。

#####（2）Access-Control-Request-Headers

该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段。

#### 预检请求的回应
服务器收到”预检”请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。回应有以下关键字段：

##### (1) Access-Control-Allow-Origin

##### (2) Access-Control-Allow-Methods
该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次”预检”请求。

##### (3) Access-Control-Allow-Headers
如果浏览器请求包括Access-Control-Request-Headers字段，则Access-Control-Allow-Headers字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在”预检”中请求的字段。

##### (4) Access-Control-Allow-Credentials
该字段与简单请求时含义相同

##### (5) Access-Control-Max-Age
该字段可选，用来指定本次预检请求的有效期，单位为秒。在此期间，不用发出另一条预检请求。

#### 浏览器的正常请求和服务器回应
一旦服务器通过了”预检”请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个Origin头信息字段。服务器的回应，也都会有一个Access-Control-Allow-Origin头信息字段。


## CORS 与 JSONP 的比较
CORS与JSONP的使用目的相同，但是比JSONP更强大。
JSONP只支持GET请求，CORS支持所有类型的HTTP请求。JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。

## 参考文章
<https://segmentfault.com/p/1210000009411938>