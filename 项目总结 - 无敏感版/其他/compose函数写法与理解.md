```js

const compose = (...functions) => {
    return function(result) {
        console.log('initial result:', result)
        for(let i = functions.length - 1; i >=0 ; i-- ) {
            result = functions[i].call(this, result)
            console.log('new result:', result)
        }
        return result
    }
}

// 调用： compose()(result)

const func1 = (result) => result + 1

const func2 = (result) => result + 2

const func3 = (result) => result * result

const result = compose(func3, func2, func1)(2)
console.log(result)
```