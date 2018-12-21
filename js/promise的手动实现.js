const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
    const _this = this
    _this.currentState = PENDING
    _this.value = undefined

    _this.resolvedCallbacks = [] // 用于保存 then() 中的回调，只有当 promise 状态为  pending 时才会缓存下来，并且每个实例最多缓存一个
    _this.rejectedCallbacks = []

    _this.resolve = function (value) {
        if (value instanceof MyPromise) {
            // 如果 value 是个 promise， 递归执行
            return value.then(_this.resolve, _this.reject)
        }

        setTimeout(() => { // 异步执行，这样可以保证执行顺序，即其他逻辑都执行完了再执行 this.resolve(value) 中的这部分逻辑
            if(_this.currentState === PENDING) {
                _this.currentState = RESOLVED
                _this.value = value
                _this.resolvedCallbacks.forEach(cb => cb())
            }
        })
    }

    _this.reject = function (reason) {
        setTimeout(()=> {
            if (_this.currentState === PENDING) {
                _this.currentState = REJECTED
                _this.value = reason
                _this.rejectedCallbacks.forEach(cb => cb())
            }
        })
    }

    try {
        fn(_this.resolve,_this.reject)
    } catch(e) {
         // try {} catch(e){} 用于解决问题： new Promise(() => throw Error('error'))
        _this.reject(e)
    }
}

/**
 * 总结：
 * (1) 构造函数接受一个 fn 立即执行函数
 * (2) _this.resolve 和 _this.reject 作为实参 传入 fn
 * (3) 使用者自己选择用什么变量作为 value 实参 传入 _this.resolve, 以及用什么变量作为 reason 实参传入 _this.reject
 */

MyPromise.prototype.then = function(onResolved, onRejected) {
    const self = this

    let promise2 // 规范 2.2.7 规定 then 必须返回一个新的 promise

    onResolved = typeof onResolved === 'function' ? onResolved : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r}

    if(self.currentState === RESOLVED) {
        return (promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const x = onResolved(self.value)
                    resolutionProcedure(promise2, x, resolve, reject)
                } catch(reason) {
                    reject(reason)
                }
            })
        }))
    }

    if(self.currentState === REJECTED) {
        return (promise2 = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const x = onRejected(self.value)
                    resolutionProcedure(promise2, x, resolve, reject)
                } catch (reason) {
                    reject(reason)
                }
            })
        }))
    }

    if(self.currentState === PENDING) {
        return (promise2 = new Promise((resolve, reject) => {
            self.resolvedCallbacks.push(function() {
                try {
                    const x = onResolved(self.value)
                    resolutionProcedure(promise2, x, resolve, reject)
                } catch(r) {
                    reject(r)
                }
            })
            self.rejectedCallbacks.push(function() {
                try {
                    const x = onRejected(self.value)
                    resolutionProcedure(promise2, x, resolve, reject)
                } catch(r) {
                    reject(r)
                }
            })
        })
    }
}

function resolutionProcedure(promise2, x, resolve, reject) {
    if(promise2 === x) {
        return reject(new TypeError('Error'))
    }

    if(x instanceof MyPromise) {
        if (x.currentState === PENDING) {
            x.then( value => {
                resolutionProcedure(promise2, value, resolve, reject)
            })
        } else {
            x.then(resolve, reject)
        }
        return 
    }

    let called = false
    if(x!== null && (typeof x === 'object' || typeof x === 'function')){
        try {
            let then = x.then
            if (typeof then === 'function') {
                then.call(
                    x,
                    y => {
                        if(called) {
                            return
                        }
                        called = true
                        resolutionProcedure(promise2, y, resolve, reject)
                    },
                    e => {
                        if(called) {
                            return
                        }
                        called = true
                        reject(e)
                    }
                )
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) {
                return
            }
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}

