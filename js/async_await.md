### 4.async
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function>

async function 声明了一个异步函数，并返回了一个 AsyncFunction 对象。

#### 语法
async function name([param[, param[, ... param]]]) {
   statements
}

- name 方法的名字。
- param 传递给方法的参数名。
- statements 方法体的语句。

#### 描述
调用异步函数时会返回一个 promise 对象。当这个异步函数返回一个值时，promise 的 resolve 方法将会处理这个返回值；当异步函数抛出的是异常或者非法值时，promise 的 reject 方法将处理这个异常值。

异步函数可能会包括  await 表达式，这将会使异步函数暂停执行并等待 promise 解析传值后，继续执行异步函数并返回解析值。

#### 使用例子
```
	function resolveAfter2Seconds(x) {
	  return new Promise(resolve => {
	    setTimeout(() => {
	      resolve(x);
	    }, 2000);
	  });
	}
	
	async function add1(x) {
	  var a = resolveAfter2Seconds(20);
	  var b = resolveAfter2Seconds(30);
	  return x + await a + await b;
	}
```

### 4.await
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await>

The await operator is used to wait for a promise returned by an async function.

#### 语法

	[rv] = await expression

###### expression
A promise or any value to wait for the resolution.

###### return

Returns the resolved value of the promise, or the value itself if it's not a promise.(**如果是promise就返回promise的resovled的值**；如果不是promise，就返回值本身)

#### Examples
```
	function resolveAfter2Seconds(x) {
	  return new Promise(resolve => {
	    setTimeout(() => {
	      resolve(x);
	    }, 2000);
	  });
	}
	
	async function f1() {
	  var x = await resolveAfter2Seconds(10);
	  console.log(x); // 10
	}
	f1();
```

#### 总结
- ***await一定要放在async函数里面，否则node不认识，node7.4.0以后才认识async/await***
- ***async一定要写在包含await语句的最内层函数函数名前***,不能 async function A ( ) { function B () { await ...}}
- async可以用于箭头函数
- 如果await的这个promise无resolve的值，那么可以直接写 await xxxx(xx)
- 它和co yield组合的作用一模一样，co yield就是为了模仿它
- 在逻辑比较简单的时候，可以直接用promise；只有当promise的链式操作不连续地使用resolve的结果时，才有必要用async/await,比如第一步promise产生的resolve的值只能在下一个then中使用，那么如果再第三个then中使用的话，就无法直接采用promise的办法了。

### 精选博客

<https://jakearchibald.com/2017/await-vs-return-vs-return-await/>