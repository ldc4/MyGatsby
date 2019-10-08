---
title: Vue学习与实践
date: '2019-09-25 09:44:27'
category: '学习'
tag: ['Vue', '起步']
draft: true
---

因为工作调动的原因，现在技术栈切到了 Vue + Express  
Vue上手倒是挺快，但是看完一遍文档还是花费了一周  
然后工作两周，发现很多东西都记不住，印象逐渐消失  

<!-- more -->

## 官方文档

### 教程
- **Vue**：https://cn.vuejs.org/v2/guide/
- **Vue Cli**: https://cli.vuejs.org/zh/guide/
- **Vue Router**: https://router.vuejs.org/zh/guide/
- **Vuex**: https://vuex.vuejs.org/zh/guide/

### API
- Vue: https://cn.vuejs.org/v2/api/
- Vue Router: https://router.vuejs.org/zh/api/
- Vuex: https://vuex.vuejs.org/zh/api/


> 虽然Vue3.0快出来，但是要普及估计还得要一段时间。


## 基础

### Vue实例

```javascript
var vm = new Vue({
    el: '#example',             // 模板中的ID
    data: {                     // 数据
        // 状态值，响应式的数据
    },
    methods: {                  // 方法
        // 一般为处理状态的方法
    }
});
```

当创建一个 Vue 实例时，你可以传入一个选项对象
> 不要在选项属性或回调上使用箭头函数

`Object.freeze()` 可以阻止响应式

带有$前缀的是vue内置属性或方法：vm.$data, vm.$el, vm.$watch

生命周期钩子：created/mounted/updated/destroyed

### 模板语法

```html
<div id="example">
  <h1>{{ message }}</h1>
  <span v-bind:title="message">
    鼠标悬停几秒钟查看此处动态绑定的提示信息！
  </span>
</div>
```

插值 {{ something }}
> Mustache 语法不能作用在 HTML 特性上

指令 v-xxx:yyy.zzz = "something"
> 指令包括指令名、参数和修饰符

- v-once 只渲染一次
- v-html 输出html
- v-bind 绑定数据
- v-on 监听DOM事件

对于所有的数据绑定，vue都提供了javascript表达式支持

每个绑定只能包含单个表达式

从2.6.0开始支持，指令动态参数

常用指令的缩写：
 - v-bind:xxx  <=> :xxx
 - v-on:xxx <=> @xxx

### 计算属性和侦听器

> 模板里不应该存在复杂的表达式，避免臃肿和难以理解  
> 对于任何复杂逻辑都应当使用计算属性computed


```javascript
var eg1 = new Vue({
  el: '#example-1',
  data: {
    message: 'xixi'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  },
});
```

computed和method的差异在是否缓存

computed包含setter和getter，默认设置为getter

watch用于处理异步或耗时较多的操作

### Class与Style绑定

v-bind: 用于class和style，vue做了增强。可以填数组和对象。

可以和普通的class和style属性共存。

vue会自动侦测并添加相应的样式前缀。

### 条件渲染

v-if

v-else-if (2.1.0增加)

v-else

可以在`<template>`元素上使用v-if

v-show 始终会渲染，不支持`<template>`，也不支持v-else

vue会复用已有的元素，通过设置key来管理复用的情况

### 列表渲染

v-for 比 v-if 优先级高

特殊语法：v-for="item in items"
> in 可以替换成 of


- 遍历数组
```
item in items
(item, index) in items
```
 

- 遍历对象
```
value in object
(value, name, index) in object
```

> 建议尽量使用key属性

#### 数组更新检查

能检查更新的情况:
  - 变异方法：push, pop, shift, unshift, splice, sort, reverse
  - 非变异方法：filter, concat, slice

不能检查更新的情况：
  1. vm.items[index] = newValue
  2. vm.items.length = newLength

解决1情况：
  - Vue.set(vm.items, index, newValue)
  - vm.items.splice(index, 1, newValue)

> vm.$set <=> Vue.set

解决2情况：
  - vm.items.splice(newLength)

#### 对象变更检查

vue不能检查对象属性的添加和删除

不允许动态添加根级别的响应式属性，但是可以使用Vue.set(object, key, value)

已有对象赋值多个新属性: `Object.assign()`  `_.extend()`

```javascript
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

v-for 也可以接受整数: `<span v-for="n in 10">{{ n }} </span>`

2.2.0+ 版本，在组件上使用v-for，必须加上key

### 事件处理

监听DOM事件 v-on

事件处理方法 method

> 可以直接在内联中直接调用方法，如需访问事件对象，使用$event

### 事件修饰符

由于event.preventDefault()或event.stopPropagation()这类DOM事件细节不应该出现在业务逻辑中。

vue给v-on指令提供了修饰符，可以串联
 - .stop  阻止单击事件继续传播
 - .prevent  提交事件不再重载页面
 - .capture 添加事件监听器时使用事件捕获模式，即元素自身触发的事件先在此处理，然后才交由内部元素进行处理
 - .self 只当在 event.target 是当前元素自身时触发处理函数，即事件不是从内部元素触发的
 - .once 2.1.4新增，事件只触发一次，可以用在自定义的组件事件上
 - .passive 2.3.0新增，滚动事件的默认行为 (即滚动行为) 将会立即触发，而不会等待 `onScroll` 完成

#### 按键修饰符

```html
<input v-on:keyup.enter="submit">
<input v-on:keyup.13="submit">
```

> 可以直接将 KeyboardEvent.key 暴露的任意有效按键名转换为 kebab-case 来作为修饰符

按键码别名：
.enter
.tab
.delete
.esc
.space
.up
.down
.left
.right

> keyCode的事件用法已经被废弃了
> 可以通过全局变量config.keyCodes自定义按键修饰符别名

```javascript
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

#### 系统修饰符

2.1.0新增

.ctrl
.alt
.shift
.meta

> 在 Mac 系统键盘上，meta 对应 command 键 (⌘)。  
> 在 Windows 系统键盘 meta 对应 Windows 徽标键 (⊞)。  
> 在 Sun 操作系统键盘上，meta 对应实心宝石键 (◆)。  
> 在其他特定键盘上，尤其在 MIT 和 Lisp 机器的键盘、以及其后继产品，比如 Knight 键盘、space-cadet 键盘，meta 被标记为“META”。  
> 在 Symbolics 键盘上，meta 被标记为“META”或者“Meta”。  

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">
<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

#### .exact修饰符

2.5.0新增

.exact 修饰符允许你控制由精确的系统修饰符组合触发的事件。

```html
<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>
<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick">A</button>
```

#### 鼠标按钮修饰符

2.2.0 新增

.left
.right
.middle

### 表单输入绑定

通过v-model可以在`<input>` `<textarea>` `<select>`元素上创建双向绑定

v-model 会忽略所有表单元素的 value、checked、selected 特性的初始值而总是将 Vue 实例的数据作为数据来源

修饰符

.lazy
.number
.trim

### 组件基础

> 组件是可复用的 Vue 实例，且带有一个名字

Vue.component()

组件的data必须是一个函数

通过props来声明需要传递的属性

监听子组件事件
- 子组件通过$emit('event-name', value)发送一个事件出来。
- 父组件监听子组件的event-name属性即可。
- 通过函数的第一个参数或者$event来获取value。

在组件上使用v-model:   
&nbsp;&nbsp;&nbsp;&nbsp;
v-model 等价于 v-bind:value 和 v-on:input


子组件中使用`<slot>`来替换父组件中调用的子组件的子节点

动态组件，通过`<component :is="component-name"></component>`来获取