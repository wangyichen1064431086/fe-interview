## 一、cookie

### 1. http头与cookie

cookie是HTTP Cookie的简称。该标准要求:

#### （1）服务器的HTTP响应头包含 Set-Cookie字段

响应头Eg:

```s
HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: name=value

```

该HTTP响应设置了一个名为name，值为value的cookie。服务器将它们发送到浏览器，浏览器就会存储这样的cookie信息。


#### （2）浏览器的HTTP请求头包含Cookie字段

请求头Eg:

```s
GET /index.html HTTP/1.1
Cookie: name=value
```

浏览器会为每个请求的请求头添加Cookie字段，将浏览器本地包含的cookie信息发送回服务器。

### 2. cookie的特点

#### （1） cookie是绑定在特定域名下的

在一个域名下设置了某cookie后，再给该域名发送请求的话都会发送该cookie。

#### （2）单个域下的cookie数量、大小有限制
##### cookie数量限制:

- IE7+:最多50个
- Firefox:最多50个
- Opera:最多30个
- Chrome和Safari：无限制

cookie超出数量限制后，浏览器会清除以前设置的cookie。具体删除方式不同浏览器不同。
**简述：不同的浏览器不一样，Chrome/Safari无限制，firefox是50个

##### cookie尺寸限制

大多数浏览器的单个域下所有cookie的总长度限制在 **4096B**左右。为了浏览器兼容性最好将其限制为 **<= 4095B**。即 **存储大小为4K**

#### （3）如果没设置失效时间,cookie在浏览器关闭时就会被删除


### 4. API：document.cookie
#### (1)获取cookie

```js
var allCookies = document.cookie;
//name1=value1;name2=value2;name3=value3
```
可以获取当前页面可获取的所有cookie,每条cookie以分号分隔。**获取cookie键值对后，需要使用decodeURIComponent() 来对每个 cookie名和cookie值解码**

#### (2)设置cookie

```js
document.cookie = encodeURIComponent(name)+ '=' + encodeURIComponent(value) + ';path=somepath;domain=somedomain;max-age=somemaxage;expires=someexpires;secure';
```

- 使用上述方法会设置新的cookie字符串。这个cookie字符串会被解释并添加到现有的cookie集合中。**并不会覆盖现有的cookie**。

- 只有name和value是必须的。最好设置时使用encodeURIComponent()对name和value进行编码。因为encodeURIComponent()可以保证它不包含任何逗号、分号或空格(cookie值中禁止使用这些值).

- 有以下可选的cookie属性可以跟在名值对之后:

  - domain=: 指定cookie对哪个域是有效的，所有该域下的页面都能访问该cookie，所有向该域发送的请求中都会发送该cookie。**默认为设置cookie的页面的域**。 也可以将其设置为其他域。如果 Cookie 的域和页面的域相同，那么我们称这个 Cookie 为第一方 Cookie（first-party cookie），如果 Cookie 的域和页面的域不同，则称之为第三方 Cookie（third-party cookie）。如果一个页面包含图片或存放在其他域上的资源（如图片）时，第一方的 Cookie 也只会发送给设置它们的服务器。

  - path=: 指定cookie对于哪个路径是有效的。如'/mydir', 即可以指定该cookie只有从指定域名下的'/mydir'路径才能访问。那么 **域下的其他路径及根目录就不能访问该cookie**，也不会向服务器发送该cookie。**默认当前文档位置的路径**

  - max-age=:指定cookie有效时间，以s为单位。***正常情况下,max-age的优先级高于expires***

  - expires=:指定cookie失效时间，为GMT格式。如： (new Date()).toUTCString()

  - secure：安全标志，指定后，cookie只能在使用SSL连接(HTTPS协议)的时候才能发送到服务器。
  
  - HttpOnly:不能通过JS访问cookie，减少XSS攻击


***注意：*** 这些属性都只存在于浏览器，并不会作为cookie信息的一部分发送到服务器，发送只发送名值对，即 **请求头中Cookie字段只包含名值对**；但是这些属性会从服务器发送到浏览器，用于给浏览器指示，即 **响应头中Set-Cookie字段不仅包含名值对，也包含这些cookie属性**

### 5. 自定义cookie方法

#### mdn的框架如下
```js

/*
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path], domain)
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
*/

var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

```

### 《JavaScript高级程序设计》的框架

```js
const CookieUtil = {
  get: function(name) {
    const cookieName = encodeURIComponent(name) + '=';
    const cookieStart = document.cookie.indexOf(cookieName);

    if(cookieStart >= 0) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart);
      if(cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }

      const cookieValue = decodeURIComponent(document.cookie.subString(cookieStart + cookieName.length, cookieEnd));
      return cookieValue;
    } else {
      return null;
    }
  },

  set: function(name, value, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    if (expires instanceof Date) {
      cookieText += `; expires=${expires.toUTCString()}`;
    }

    if (path) {
      cookieText += `; path=${path}`;
    }

    if (domain) {
      cookieText += `; domain=${domain}`;
    }

    if (secure) {
      cookieText += `; secure`
    }

    document.cookie = cookieText;
  },

  unset: function(name, path, domain, secure) {
    this.set(encodeURIComponent(name), this.get(name), (new Date(0)).toUTCString(),path, domain, secure)
  }
}

```

#### FTC框架

```js
function getCookie(name) {
  const cookieStr = document.cookie;
  const nameLen = name.length;
  const nameStartIndex = cookieStr.indexOf(name+'=');
  if (nameStartIndex < 0) {
    return null;
  }
  const valueStartIndex = nameStartIndex + nameLen + 1;
  let valueEndIndex = cookieStr.indexOf(';', valueStartIndex);

  if( !valueStartIndex && name !== cookieStr.substring(0, nameLen)) {////当startIndex为0的时候说明该name是第一个cookie,那name必须就是cookieStr.substring(0, name.length)
    return null;
  }
  
  if (valueEndIndex === -1) { //说明它就是最后一个cookie，后面没有;
    valueEndIndex = cookieStr.length;
  }
  return decodeURIComponent(cookieStr.substring(valueStartIndex, valueEndIndex));
}

function setCookie(name, value, path, domain, expires, secure) {
  let cookieStr = '';
  if(name && value) {
     cookieStr = `${decodeURIComponent(name)}=${decodeURIComponent(value)};`
  }else {
    return;
  }

  if(path) {
    cookieStr += `path=${path};`;
  }
  if(domain) {
    cookieStr += `domain=${domain};`;
  }
  if(expires && typeof expires === 'string'){
    if((new Date(expires)) instanceof Date) {
      cookieStr += `expires=${new Date(expires).toUTCString()};`
    }
  } else if (expires && expires instanceof Date) {
    cookieStr += `expires=${expires.toUTCString()};`
  }

  if(secure) {
    cookieStr += `secure=${secure};`
  }
  document.cookie =cookieStr;
}


function deleteCookie (name, domain, path) {  
  var cval = getCookie (name);
  var expires = new Date(1970,01,01).toUTCString();
  document.cookie = encodeURIComponent(name) + '=;'+ cval +' expires='+ expires +';domain=' + (domain ? domain : location.hostname) + ';path=' + (path ? path : '/');
}
```

### 6. *子cookie

#### 存在意义

为了绕开 **浏览器单域名下的cookie数限制**。使用子cookie可以使用单个cookie进行存储和访问，而非对每一个名值对使用不同的cookie存储。

子cookie的最常见格式:

```s
name=name1=value1&name2=value2&name3=value3
```

#### 获取子cookie信息的方法

```js
const SubCookieUtil = {
  get: function(name, subName) {
    const subCookies = this.getAll(name);
    if(subCookies) {
      return subCookies[subName];
    } else {
      return null;
    }
  },

  getAll: function(name, subName) {
    const cookieName = name + '=';
    const cookieStart = document.cookie.indexOf(cookieName);
    let subCookieValueStr;

    if (cookieStart >= 0) {
      var cookieEnd = document.cookie.indexOf(';',cookieStart);
      if (cookieEnd <0 ) {
        cookieEnd = document.cookie.length;
      }
      subCookieValueStr = document.cookie.subString(cookieStart + cookieName.length, cookieEnd);


      if (subCookieValueStr.length > 0) {
        subCookieItemArr = subCookieValueStr.split('&');

        const result = {};
        for (let item of subCookieItemArr) {
          const keyValueArr = item.split('=');
          if(keyValueArr.length == 2) {
            result[decodeURIComponent(keyValueArr[0])] = decodeURIComponent(keyValueArr[1]);
          }
        }
        return result;
      }

      return null;
    }
    return null;
  }
}
```

## 二、Web Storage: sessionStorage 和localStorage

### 1.Web Storage简介
Web Storage包括 sessionStorage, globalStorage,localStorage三种。

#### 特点
克服了cookie的一些限制：

- Web Storage存储的数据被严格 **控制在客户端**，**不会将数据发回服务器**
- 数据存储容量更大。对于localStorage，大多数浏览器对每个源限制5MB，也有2.5MB的。sessionStorage有的限制是2.5MB,有的是5MB。**localStroge大多数浏览器是5M,cookie尺寸限制大多数是4k**

三种类型的特点各不相同。

#### API
##### 方法：
三种Storage实例都有以下方法:

- Storage.getItem(name):获取指定名字对应的值
- Storage.key(index):获得index位置处的名值对的名字
- Storage.removeItem(name): 删除由name指定的名值对
- Storage.setItem(name, value):为指定的name设置一个值

每个名值对是作为属性存储在Storage对象上的，所以也可以通过'.'或'[]'访问属性来获取值，通过delete删除对象属性。但 **更推荐用方法** 来访问数据。

##### 事件
storage事件。

对Storage对象的任何修改都会触发storage事件。包括添加、修改、删除数据。

其event对象属性:

- domain：发生变化的存储空间的域名
- key:设置或删除的键名
- newValue:如果是设置值，就为新值；如果是删除值，就为null
- oldValue:修改之前的值

### 2. sessionStorage对象

#### 简介

sessionStorage对象存储 **特定于某个会话(页面）**的数据，对 **特定于某个会话**的理解:

- 会话就是 **页面** 的意思。其中的数据只能由 **最初给对象存储数据的页面**访问。即不可被其他页面访问。
- 页面会话在浏览器打开期间一直保持，并且 **重新加载或恢复页面仍会保持原来的页面会话**。**在新标签或新窗口打开一个页面会初始化一个新的会话**。
- 其中的数据会在页面会话结束（即 **浏览器关闭**）时被清除。

#### 用例:

```js
sessionStorage.setItem('name','Boonie');
sessionStorage.getItem('name');//"Boonie"
sessionStorage.removeItem('name');


const data = {};
for(let i=0, len = sessionStorage.length; i<len; i++) {
  const name = sessionStorage.key(i);
  const value = sessionStorage.getItem(name);
  data[name] = value;
}

```

### 3. localStorage对象

#### 简介

localStorage对象存储 **特定于某个域名**的、**跨对话**的、**持久保存**的数据。具体理解:

- 访问同一个localStorage对象，页面必须符合 **同源协议**（即域名、协议和端口相同）
- 可以跨对话（页面）访问，只要页面符合同源协议
- 如果 **不使用removeItem()或delete删除，也不清除浏览器缓存**，存储于localStorage的数据将 **一直存在**，一直保留在磁盘上。

#### 用例

```js
localStorage.setItem('name', 'Bonnie');
localStorage.getItem('name');
```

### 4. *globalStorage['xxx.com']对象

#### 简介

localStorage取代了globalStorage。 

特性和localStorage基本一样，但相比localStorage, globalStorage有特定的访问限制：需要通过[]来指定域。**globalStorage对象不是Storage实例，globalStorage['xxx.com']才是Storage实例。**

localStorage相当于 **globalStorage[location.host]**

**大多浏览器都不支持globalStorage,Chrome也不支持。**

> tips: location.host包含域名和端口号，location.hostname只是域名，location.port只是端口号，location.origin包含完整的协议、域名、端口号

#### 用例

```js
globalStorage['www.example.com'].getItem('name');
```



### 参考资料
<https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie>
<https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API>