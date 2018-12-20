
# redux-form
## 概述
让你的 react form 组件和 redux store 联系起来，你需要 redux-form 包的以下东西：
- formReducer: 一个 redux reducer。一个Function, 基于来自应用程序的变化告诉 redux store 怎样更新，这些变化通过 redux actions 描述。
- reduxForm(): 一个 HOC。一个 Function, 接受配置对象，并返回一个新的函数。使用它来包裹 form 组件，并将用户操作和 redux actions 的 dispatch 绑定起来。
- <Field/>组件：一个component。 位于你的被包裹的 form 内部的组件。使用它来将 input 组件和 redux-form 的逻辑 connect 起来。

一个简单的例子：我们有一个被 reduxForm() 包裹的 form 组件。里面有一个 被 < Field/> 包裹的 text input 组件。数据流就是这样的：
1. 用户点击 input
2. Focus action 被 dispatch
3. formReducer 更新相关的 state 片段
4. state 被返回 input

## 使用方法
### 1. Form reducer
store 需要知道如何处理来自 form 组件的 actions。为了实现这个，我们需要将 formReducer 传递给 store。它会为你的所有的 form 组件服务，所以你只需要传递一次：

```js
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-from'

const rootReducer = combineReducers({
    //... other reducers
    form: formReducer
})

const store = createStore(rootReducer)
```

现在你的 store 就知道该怎样处理来自 form 组件的 actions 了。

> 注意：这里的 reducer 的 key 必须是 'form'

### 2. Form 组件
为了让你的 form 组件可以和 store 通话，我们需要将 form 组件用 reduxForm() 包裹起来。 reduxForm()提供了有关 form state 的 props，以及处理 submit 的函数。

```js
import React from 'react'
import { Field, reduxForm } from 'redux-form'

let ContactForm = props => {
    const { handleSubmit } = props
    return <form onSubmit={ handleSubmit }></form>
}
ContactForm = reduxForm({
    form: 'contact'//这里要给 form 提供一个唯一的名称
})(ContactForm)

export default ContactForm
```
这里等同于：
```js
createReduxForm = reduxForm({ form:'contact' })
ContactForm = createReduxForm(ContactForm)
```

### 3. Field 组件
Field 组件将每个 input 和 store 联系起来。基本用法是：
```jsx
<Field name="inputName" component="input" type="text" />
```

完整的写法就是：
```js
import React from 'react'
import { Field, reduxForm } from 'redux-form'

let ContactForm = props => {
    const {handleSubmit} = props
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="firstName">FirstName</label>
                <Field name="firstName" component="input" type="text" />
            </div>
            <div>
                <label htmlFor="lastName">Last Name </label>
                <Field name="lastName" component="input" type="text" />
            </div>
            <button type="submit">Submit</button>
        </form>
    )
}

ContactForm = reduxForm({
    form:'contact'
})(ContactForm)

export default ContactForm
```
现在， store 就会基于来自你的 form 组件的actions被填充。

