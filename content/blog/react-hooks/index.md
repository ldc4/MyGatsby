---
title: React Hooks
date: '2019-05-07 12:25:53'
category: '学习'
tags: ['react', '新特性']
---

相关链接：
[官方文档（中文）](https://zh-hans.reactjs.org/docs/hooks-intro.html)
[精读React Hooks](https://github.com/dt-fe/weekly/blob/master/79.%E7%B2%BE%E8%AF%BB%E3%80%8AReact%20Hooks%E3%80%8B.md)
[拥抱React Hooks](https://juejin.im/post/5ccd3f8fe51d455c6049b7e6?utm_source=gold_browser_extension)

为什么要创造Hook？
1. 在组件之间复用状态逻辑很难 （这个可以理解）
2. 复杂组件变得难以理解（任何组件复杂了，都会变得难以理解）
3. 难以理解的class（class还是很好用的）

<!-- more -->

## 阅读笔记

hook是react16.8正式引入的特性，是一些可以让你在函数组件里“钩入”React state及生命周期等特性的函数。

### Hook Demo Code

react hook大致长这个样：

```javascript
import React, { useState, useEffect } from 'react';

function Foo() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        document.title = `${count}`;
    });
    
    function handleClick() {
        setCount(count++);
    }
    
    return (
        <div onClick={handleClick}>{count}</div>
    );
}
```

### Hook API索引
[https://zh-hans.reactjs.org/docs/hooks-reference.html](https://zh-hans.reactjs.org/docs/hooks-reference.html)

- 基础hook
  - **useState** 替代class state
  - **useEffect** 替代生命周期函数（componentDidMount，componentDidUpdate， componentWillUnmount）
  - useContext 替代class context
- 高级hook
  - useReducer
  - useCallback
  - useMemo
  - useRef
  - useImperativeHandle
  - useLayoutEffect
  - useDebugValue

### Hook 使用规则

官方提供了eslint插件：[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)

1. **只能在函数最外层调用hook。不要在循环、条件判断或者子函数中调用。**
   - 这样可以确保Hook在每一次渲染中都按照同样的顺序被调用
2. **只在React函数中调用hook。不要在普通的 JavaScript 函数中调用 Hook。**
   - 在React的函数组件中调用hook
   - 在自定义hook中调用其他hook 

### Hook 哲学

使用多个Effect实现关注点分离

Hook 允许我们按照代码的用途分离他们， 而不是像生命周期函数那样

使用 Hook 其中一个目的就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题

useEffect它会在调用一个新的 effect 之前对前一个 effect 进行清理。

useEffect的第二个参数为依赖列表，支持跳过Effect执行。

如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。

### 自定义Hook

约定命名以use开头的函数，可以自定义出入参，和函数组件一样，可以使用hook

## 实践

coming soon..