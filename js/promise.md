## 一、Propmise基本用法
Promise用于发送一个异步完成的结果，是替代回调函数的另一种选择。可以把Promise理解为一种异步函数。

以下函数通过一个Promise来异步地返回一个结果

```js
function asyncFunc() {
	return new Promise(
		function (resolve, reject) {
			···
			resolve(result);
			···
			reject(error);
		});
}
```

你可以这样调用它：

```js
asyncFunc()
.then(result => { ··· })
.catch(error => { ··· });
```

> **NOTE**
> promise正常情况下结果只能用.then(result =>)来获取。
> 特殊情况下，在[co](https://www.npmjs.com/package/co)工具中,使用yield可以得到Promise的结果。

### 1. Chaining then() calls(链式调用then)

then() 总是返回一个Promise,这使得你可以链式调用：

```js
asyncFunc1()//----设该函数会得到一个promise P，它会resolve出来result1
.then(result1 => {
	// Use result1
	return asyncFunction2(); // 得到一个promise A, 它会resolve出来result2
})
.then(result2 => { // 
	// Use result2
})
.catch(error => {
	// Handle errors of asyncFunc1() and asyncFunc2()
});
```

Promise P在.then()之后返回了什么东西取决于then中的函数做了什么：

- 如果then()中的函数返回的是一个Promise（如A）, 则这个 Promise的resolve的结果值传递为P的resolve结果值。
- 如果then()中的函数返回了一个不同的值,则这个值会变成P的resolve值。
- 如果then()中的函数抛出了一个意外，则P会因为这个意外而被rejected。

### 2. Executing asynchronous functions in parallel(并行执行异步函数）

如果你通过then()链式调用Promise，它们就会按顺序执行，一个时间只执行一个Promise

如果你不这样采用链式调用，而是立即调用它们，则它们会并行执行。

而Promise.all()使得你可以一次性获得所有结果。其输入是一个由一系列Promises组成的数组，其输出是一个单个的Promise,其resolve的结果值是一个由一系列结果组成的数组。

```js
Promise.all([
asyncFunc1(),
asyncFunc2(),
])
.then(([result1,result2]) => {

})
.catch(err => {
// Receives first rejection among the Promises
});
```

## 二、Promise对象详述
Promise对象用于表示一个异步操作的最终状态(完成或失败)，以及其返回的值。

Eg:使用Promise构造函数构造一个promise对象实例:

```js
var promise1 = new Promise(function(resolve, reject) {
	setTimeout(resolve, 1000, 'foo');//即1s后执行resolve('foo')
});

console.log(promise1);//Promise {<resolved>: "foo"}
```

Promise 对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是返回一个能代表未来出现的结果的promise对象。

### Promise对象的状态
一个 Promise有以下几种状态:

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled/resolved: 意味着操作成功完成。
- rejected: 意味着操作失败。

> 注意: 如果一个promise对象处在fulfilled或rejected状态而不是pending状态，那么它也可以被称为settled状态。你可能也会听到一个术语resolved ，它表示promise对象处于fulfilled状态。

返回pending状态的promise：
```js
new Promise(()=>{}) //Promise {<pending>}
```
当新对象保持“pending”状态时，原Promise链将会中止执行。


### 语法

```js
new Promise(function(resolve, reject){})
```

param:

- executor: TYPE function 带有resolve和reject两个参数的函数.Promise构造函数执行时立即调用executor 函数， resolve 和 reject 两个函数作为参数传递给executor（executor 函数在Promise构造函数返回新建对象前被调用）。executor 内部通常会执行一些异步操作，一旦完成，可以调用resolve函数来将promise状态改成fulfilled，或者在发生错误时将它的状态改为rejected。

## 三、Promise类的方法

### 1. Promise.all(iterable)
返回一个新的Promise实例，此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中promise有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败的promise 的结果。

此方法在集合多个 promise 的返回结果时很有用。

#### 语法
```js
Promise.all(iterable)
```

param:
- iterable: 一个可迭代对象，如Array。
	- 如果iterable是一个空的可迭代对象，则返回一个已完成(already resolved)状态的promise;
	- 如果iterable中不包含任何promise,则返回一个异步完成(asynchronously resolved)状态的promise;
	- 其他情况下返回一个处理中(pending)状态的promise。这个返回的 promise 之后会在所有的 promise 都完成或有一个 promise 失败时异步地变为完成(resolved)或失败(rejected)。

#### 示例1:Promise.all基本用法
```js
var p1 = Promise.resolve(3);
var p2 = 1337;
var p3 = new Promise((resolve,reject) => {
	setTimeout(resolve, 1000, 'foo');
});
Promise.all([p1,p2,p3]).then(values => {
	console.log(values);//1s后得到:[3, 1337, "foo"]
});
```

#### 示例2：Promise.all的同步和异步情况
> 注意: Promise.all当且仅当传入的可迭代对象为空时为同步，其他都是异步的
```js
var p = Promise.all([]); // will be immediately resolved
var p2 = Promise.all([1337, "hi"]); // 

console.log(p);//Promise {<resolved>: Array(0)}
console.log(p2);//Promise {<pending>} //立刻执行console.log(p2)是pending,过一会儿执行console.log(p2)是resolved;立刻直接输入p2也得到的是resolved
setTimeout(function(){
    console.log(p1);//Promise {<resolved>: Array(0)}
    console.log(p2);//Promise {<resolved>: Array(2)}
});
```

#### 示例3：Promise.all之后的链式处理
> 注意：如果Promise.all传入了若干个promise,如果其中有一个promise立即调用失败函数，其他promise都是在一定时间后调用成功函数，那么Promise.all将立即变为失败。

```js
var p1 = new Promise((resolve, reject) => { 
  setTimeout(resolve, 1000, 'one'); 
}); 
var p2 = new Promise((resolve, reject) => { 
  setTimeout(resolve, 2000, 'two'); 
});
var p3 = new Promise((resolve, reject) => {
	reject('three reject')
});

//使用then()
Promise.all([p1,p2,p3]).then(resultArr => {
	console.log(resultArr);
}, err => {
	console.log(err);
});

/*控制台输出:
three reject
*/

//或者使用.then().catch()
Promise.all([p1, p2, p3]).then(resultArr => {
	console.log(resultArr);
}).catch(err=> {
	console.log(err);
})
```

### 2. Promise.race(iterable)
返回一个promise,一旦iterable中的某个promise变为resolved或rejected,返回的promise就变为resolved或rejected。

#### 语法
```js
Promise.race(iterable);
```

param：
- iterable:可迭代对象，类似Array，同1.Promise.all(iterable)的参数iterable

return:
一个promise对象实例，只要给定的iterable中有一个promise变为resolved或rejected，那么就采用第一个状态变为resolved或rejected的这个promise的值，从而异步地变为resolved或rejected。

#### 示例
```js
var p1 = new Promise(function(resolve, reject) { 
    setTimeout(resolve, 5000, "one"); 
});
var p2 = new Promise(function(resolve, reject) { 
    setTimeout(resolve, 1000, "two"); 
});

Promise.race([p1, p2]).then(result => {
  console.log(result); // "two"
  // 两个都resolved，但 p2 更快,故得到的resolved的promise采用p2 resolve的值
});
```




### 3. Promise.resolve(result)
返回一个给定resolve值的resolved状态的promise对象实例。

#### 语法
```js
Promise.resolve(value);
Promise.resolve(promise);
Promise.resolve(thenable);
```

param:
- 将被Promise对象resolve的值。可以是一个简单值，也可以是一个Promise对象实例，也可以是一个thenable

return:
- 如果参数是一个简单值，则返回一个resolved状态的带着resolved的值的Promise对象；
- 如果参数是一个promise对象，则直接返回这个Promise对象。
- 如果参数是一个thenable对象，则会跟随这个thenable对象，采用它最终状态的Promise

#### 示例1：resolve简单值
```js
Promise.resolve('success').then(result => {
	console.log(result);//success
}, (err)=>{
	console.log(err); //then的第二个参数这个函数不会被调用
});
```

#### 示例2：resolve另一个promise对象
```js
var promise1 = 	Promise.resolve('1');
var promise2 = Promise.resolve(promise1);
promise2.then(result => {
	console.log(result);
});
console.log('promise1===promise2:', promise1===promise2);

/* 控制台输出（按顺序）
promise1===promise2: true
1
*/
```

#### 示例3：resolve thenable对象
```js
var thenableObj = {
	then: (resolve,reject) => {
		resolve('success');
	}
}

console.log(Object.prototype.toString.call(thenableObj));//[object Object]

var promise1 = Promise.resolve(thenableObj);
console.log(promise1 instanceof Promise);//true

promise1.then((result) => {
	console.log(result);//'success'
}, (err) => {
	console.log(err);//不会调用
});
```

### 4. Promise.reject(err)
返回一个带有reject原因err的rejected状态的promise对象。

#### 语法
```js
Promise.reject(err)
```

param：
	- err: 表示rejected的原因。可以为String或Err

return:
一个给定了reject原因的rejected状态的promise。

#### 示例
```js
Promise.reject(new Error("failed")).then(result => {
	console.log(result);//then中的第一个函数未被调用
}, err => {
	console.log(err);//Error:failed
});
```
## 四、Promise实例方法(原型方法)
### 1. Promise.prototype.then(onResolved, onRejected)
返回一个promise。最多需要两个参数:成功和失败情况的回调函数。

#### 语法
```js
promise.then(onResolved, onReject);

promise.then(result => {
	//onResolved
}, err => {
	//onRejected
});

```

Params:

- onResolved: 当promise变成resolved状态时，该参数作为回调函数被调用。该函数有一个参数，即resolve的结果。**如果传入的onResolved参数不是函数类型，则会在内部被替换为(result)=>result,此result为then之前的promise resolve的值**。
- onRejected: 当promise变成rejected状态时，该参数作为回调函数被调用。该函数有一个参数，即reject的错误原因。

Return:
then方法返回一个Promise，而它的行为与then中的回调函数的返回值有关：
- 如果then中的回调函数返回一个值，那么then返回的Promise将会成为resolved状态，并且将返回的值作为resolved回调函数的参数值。
- 如果then中的回调函数抛出一个错误，那么then返回的Promise将会成为rejected状态，并且将抛出的错误作为rejected回调函数的参数值。
- 如果then中的回调函数返回一个已经是resolved状态的Promise，那么then返回的Promise也会成为resolved状态，并且将那个Promise的resolved状态的回调函数的参数值作为该被返回的Promise的resolved状态回调函数的参数值。
- 如果then中的回调函数返回一个已经是rejected状态的Promise，那么then返回的Promise也会成为rejected状态，并且将那个Promise的rejected状态的回调函数的参数值作为该被返回的Promise的rejected状态回调函数的参数值。
- 如果then中的回调函数返回一个pending状态的Promise，那么then返回Promise的状态也是pending的，并且它的终态与那个Promise的终态相同；同时，它变为终态时调用的回调函数参数与那个Promise变为终态时的回调函数的参数是相同的。

#### 示例1：传入then的参数不是函数
```js
(new Promise((resolve, reject) => {
	resolve('1')
})).then('2')
.then(result => {
	console.log(result);//1
})
```

#### 示例2：链式调用
```js
Promise.resolve('1')
	.then(result => {
		return new Promise((resolve, reject)=>{
			setTimeout(() => {
				result += '2';
				resolve(result);
			}, 1000);
		});
	}).then(result => {
		setTimeout(() => {
			result += '3';
			console.log(result);//123
			//此处没有将新拼接的result resolve
		}, 1000);
	}).then(result => {
		console.log(result);//undefined
	});
```

#### 示例3：链式调用中抛出错误
```js
Promise.resolve()
	.then(() => {
		throw 'Oh no!';
	})
	.then(() => {
		console.log('Not called');//没有被调用
	}, err=>{
		console.error('onRejected handler called:', err);//输出错误:onRejected handler called: Oh no!
	});
```

#### 示例4：链式调用中途得到rejected状态的promise
```js
Promise.reject()
	.then( 
		() => 1,//不执行
	  () => 2//执行
	).then(result => {
		console.log(result)//2
	});
```

### 2. Promise.prototype.catch(onRejected)
返回一个promise，并且处理rejected状态。它的行为与调用Promise.prototype.then(undefined, onRejected) 相同。 (事实上, 调用catch(onRejected) 内部调用了then(undefined, onRejected)).

#### 语法
```js
promise.catch(onRejected);

promise.catch(err => {

})
```

Param:
- onRejected：当promise变为rejected状态时调用的处理函数。该函数拥有一个参数err,为获取的rejected的原因。

> 注意： 如果 onRejected处理函数抛出一个错误或返回一个本身就是rejected状态的 Promise ，那么通过该catch()返回的Promise会变为rejected状态；否则，它将回是resolved状态。

Return
一个promise

#### 示例
```js
var p1 = new Promise(function(resolve, reject) {
  resolve('Success');
});

p1.then(function(value) {
  console.log(value); // "Success"
  throw 'oh, no!';
}).catch(function(e) {
  console.log(e); // "oh, no!"
}).then(function(){
  console.log('The promise returned by catch() is resolved'); //'The promise returned by catch() is resolved'
}, function () {
  console.log('The promise returned by catch() is rejected');//没有执行
});
```

### 3. Promise.prototype.finally(onFinally)
返回一个promise。在执行then()和catch()后，都会执行finally(onFinally)中的onFinnally回调函数。它的意义是避免同样的语句需要在then()和catch()中各写一次的情况。

#### 语法
```js
promise.finally(onFinally);

promise.finally(() => {

})
```

Param:
- onFinnaly: Promise 状态改变后执行的回调函数。该函数无参数。

Return:
- 一个promise对象


注意：
- 由于无法知道promise的最终状态，所以finally的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况。
- 与Promise.resolve(2).then(() => {}, () => {}) （resolved的结果为undefined）不同，Promise.resolve(2).finally(() => {}) resolved的结果为 2。
- 同样，Promise.reject(3).then(() => {}, () => {}) (resolved 的结果为undefined), Promise.reject(3).finally(() => {}) rejected 的结果为 3。


## 参考资料
<http://exploringjs.com/es6/ch_promises.html>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve>
<https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject>