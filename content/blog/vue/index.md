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

## 深入了解组件

### 组件注册

```javascript
Vue.component('my-component-name', { /* ... */ })
```

组件名：
1. kebab-case命名
2. PascalCase命名（同时会自动转换成kebab-case命名）
> 直接在DOM中引用只有kebab-case命名有效

全局注册: Vue.component
> 在注册之后的vue实例中可以引用

局部注册：通过components属性声明

### Prop

HTML 中的特性名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符

当你使用 DOM 中的模板时，camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名

Prop类型:
```javascript
props: {
  title: String,
  likes: Number,
  isPublished: Boolean,
  commentIds: Array,
  author: Object,
  callback: Function,
  contactsPromise: Promise // or any other constructor
}
```

传递静态或动态的Prop：v-bind

传递一个对象的所有属性：
```html
<blog-post v-bind="post"></blog-post>
```

单向数据流：不应该在子组件内部修改prop

可以单独赋值给data或computed

Prop验证：
```javascript
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
}) 
```

> 注意那些 prop 会在一个组件实例创建之前进行验证，所以实例的属性 (如 data、computed 等) 在 default 或 validator 函数中是不可用的。
 

非prop的特性：指传向一个组件，但是该组件并没有相应prop定义的特性

这些特性会被添加到这个组件的根元素

class和type属性是会合并起来的。
 
禁用特性继承：inheritAttrs: false，不会影响class和style

通过$attrs来手动决定特性

### 自定义事件

事件名不存在自动大小写转换，推荐始终使用kebab-case

自定义v-model默认是value属性和input事件  
类似checkbox,radio这种，其值应该是checked属性和change事件  
可以通过model属性来修改  

将原生事件绑定到组件上  
在一个组件的根元素上直接监听一个原生事件，使用v-on的.native修饰符  
vue提供了$listeners内置属性


.sync修饰符

v-bind.sync:xxx为v-bind:xxx和v-on:update:xxx的缩写，来模拟双向绑定。

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
<text-document v-bind:title.sync="doc.title"></text-document>
<text-document v-bind.sync="doc"></text-document>
```

> 不能和表达式一起使用  
> v-bind.sync="obj"中，obj是不支持字面量对象

### 插槽

Vue 实现了一套内容分发的 API，这套 API 的设计灵感源自 Web Components 规范草案，将 `<slot>` 元素作为承载分发内容的出口。

```
<slot>后备内容</slot>
```

编译作用域：  
父级模板里的所有内容都是在父级作用域中编译的；  
子模板里的所有内容都是在子作用域中编译的。
 

#### 具名插槽

name属性: `<slot name="header"></slot>`

在template中，通过v-slot:name指令来引用
```html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>
```

具名插槽的缩写：`<template #slotName>`
> 缩写只在其有参数的时候才可

#### 作用域插槽

后备内容是在父作用域中渲染的，所以需要绑定属性

插槽prop：绑定在`<slot v-bind:prop="value">`元素上的特性

在父级作用域中的v-slot指令的值可以定义这个插槽prop的名字，用于引用
```html
<template v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</template>
```

> 当被提供的内容只有默认插槽时，组件的标签才可以被当作插槽的模板来使用  
> v-slot不能嵌套

在支持的环境下，使用ES2015解构来传入具体的插槽prop

动态插槽名：`<template v-slot:[slotName]>`

插槽 prop 允许我们将插槽转换为可复用的模板，这些模板可以基于输入的 prop 渲染出不同的内容。
> 这在设计封装数据逻辑同时允许父级组件自定义部分布局的可复用组件时是最有用的。

### 动态组件&异步组件

`<keep-alive>`包裹组件，可以保留其状态
> 要求被切换到的组件都有自己的名字，不论是通过组件的 name 选项还是局部/全局注册。

```html
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

异步组件：Vue 允许你以一个工厂函数的方式定义你的组件

```javascript
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```

结合code-splitting

```javascript
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 `require` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包，这些包
  // 会通过 Ajax 请求加载
  require(['./my-async-component'], resolve)
})
```

也可以在工厂函数中返回一个 Promise（结合 webpack 2 和 ES2015 语法）

```javascript
Vue.component(
  'async-webpack-example',
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)

// 局部注册
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

处理加载状态

```javascript
const AsyncComponent = () => ({
  // 需要加载的组件 (应该是一个 `Promise` 对象)
  component: import('./MyComponent.vue'),
  // 异步组件加载时使用的组件
  loading: LoadingComponent,
  // 加载失败时使用的组件
  error: ErrorComponent,
  // 展示加载时组件的延时时间。默认值是 200 (毫秒)
  delay: 200,
  // 如果提供了超时时间且组件加载也超时了，
  // 则使用加载失败时使用的组件。默认值是：`Infinity`
  timeout: 3000
})
```

> 注意如果你希望在 Vue Router 的路由组件中使用上述语法的话，你必须使用 Vue Router 2.4.0+ 版本。

### 处理边界情况

访问根实例：`this.$root`
> 所有的子组件都可以将这个实例作为一个全局 store 来访问或使用  
> 推荐使用 Vuex 来管理应用的状态

访问父级组件实例：`this.$parent`

访问子组件实例或子元素：`<demo ref="x">`  `this.$refs.x`

> $refs 只会在组件渲染完成之后生效，并且它们不是响应式的。  
> 这仅作为一个用于直接操作子组件的“逃生舱，你应该避免在模板或计算属性中访问 $refs


依赖注入：provide 和 inject

父组件：
```javascript
provide: function() {
    return {
        getContext: this.getContext    
    }
}
```
子组件：
```javascript
inject: ['getContext']
```

程序化的事件侦听器  
$on(eventName, eventHandler)  
$once(eventName, eventHandler)  
$off(eventName, eventHandler)  

递归组件，组件可以在自身的模板中调用自己
> 请确保递归调用是条件性的

组件之间的循环引用
全局注册不存在悖论

使用一个模块系统依赖/导入组件，解决悖论：

等到生命周期钩子 beforeCreate 时去注册它
```javascript
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```

本地注册组件的时候，可以使用 webpack 的异步 import
```javascript
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```

内联模板（定义在Vue所属的DOM元素内）
```html
<demo inline-templat>
    <div>haha</div>
</demo>
```

X-Template（定义在Vue所属的DOM元素外）
```html
<script type="text/x-template" id="xixi-template">
    <div>xixi</div>
</script>
```
```javascript
Vue.component('xixi', {
    template: '#xixi-template'
})
```

强制更新：$forceUpdate

通过v-once创建低开销的静态组件

## 过渡&动画

单元素/组件过渡 

vue提供了transition的封装组件，包含情况：
- v-if
- v-show
- 动态组件
- 组件根节点

当插入或删除包含在 transition 组件中的元素时，Vue 将会做以下处理：
- 自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名。
- 如果过渡组件提供了 JavaScript 钩子函数，这些钩子函数将在恰当的时机被调用。
- 如果没有找到 JavaScript 钩子并且也没有检测到 CSS 过渡/动画，DOM 操作 (插入/删除) 在下一帧中立即执行。

过渡的类名：
- v-enter
- v-enter-active
- v-enter-to
- v-leave
- v-leave-active
- v-leave-to

如果`<transition name="fade">`包含name，则样式的前缀v变成fade

自定义类名：(通过以下特性来自定义)
- enter-class
- enter-active-class
- enter-to-class
- leave-class
- leave-active-class
- leave-to-class

type用于设置你需要监听的动画/过渡类型，用于同时存在的情况。
- animation
- transition

duration用于设置一个显性的过渡持续时间，用于嵌套的元素有更长的过渡时间

可以在属性中声明钩子
```html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"

  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```
```javascript
// ...
methods: {
  // --------
  // 进入中
  // --------

  beforeEnter: function (el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  enter: function (el, done) {
    // ...
    done()
  },
  afterEnter: function (el) {
    // ...
  },
  enterCancelled: function (el) {
    // ...
  },

  // --------
  // 离开时
  // --------

  beforeLeave: function (el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  leave: function (el, done) {
    // ...
    done()
  },
  afterLeave: function (el) {
    // ...
  },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled: function (el) {
    // ...
  }
}
```

> 当只用 JavaScript 过渡的时候，在 enter 和 leave 中必须使用 done 进行回调。否则，它们将被同步调用，过渡会立即完成。
> 对于仅使用 JavaScript 过渡的元素添加 v-bind:css="false"，Vue 会跳过 CSS 的检测

初始渲染过渡： appear

多元素过渡：v-if / v-else 天然ok，否则采用不同的key来标识，不然同元素只会替换内容，不会替换元素

过渡模式：
- in-out 新元素先进行过渡，完成之后当前元素过渡离开。
- out-in 当前元素先进行过渡，完成之后新元素过渡进入。

多组件过渡：用动态组件即可

列表过渡：`<transition-group tag="div">`
- 进入/离开过渡
- 排序过渡：v-move特性
  > Vue 使用了一个叫 FLIP 简单的动画队列  
  > 使用 transforms 将元素从之前的位置平滑过渡新的位置
- 交错过渡

可复用的过渡：通过`<transition>`组件封装起来

动态过渡: `<transition v-bind:name="transitionName">`

状态过渡：对于数据元素本身的动效

可以通过watch结合计算库（例如：tween.js）来实现。


## 可复用性&组合

### 混入Mixin

全局混入：`Vue.mixin({ ... })`

> 一旦使用全局混入，它将影响每一个之后创建的 Vue 实例

局部混入：`Vue.component({ mixins: [...] })`

> Vue.config.optionMergeStrategies.xxx 可以设置自定义选项xxx的合并逻辑

### 自定义指令

全局注册：

```javascript
Vue.directive('focus', {
    inserted: function(el) {
        el.focus()
    }
})
```

局部注册：使用directives选项

```javascript
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

钩子函数：
- bind：指令第一次绑定到元素时调用。（用于初始化）
- inserted：被绑元素插入父节点时调用。 (仅保证父节点存在，但不一定已被插入文档中)
- update：所在组件的VNode更新时调用。（但是可能发生在其子 VNode 更新之前）
- componentUpdated：指令所在组件的VNode及其子VNode全部更新后调用。
- unbind: 指令与元素解绑时调用。

钩子函数参数：
- el: 所绑定的元素
- binding: 
    - name: 指令名
    - value: 绑定的值
    - oldValue: 绑定的前一个值（update / componentUpdated 中使用）
    - expression: 字符串形式的指令表达式
    - arg: 指令参数
    - modifiers: 修饰符对象
- vnode: Vue编译生成的虚拟节点
- oldVnode: 上一个虚拟节点（update / componentUpadted 中使用）

> 除了 el 之外，其它参数都应该是只读的，切勿进行修改
> 如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行。


动态指令参数：`v-mydirective:[argument]="value"`

函数简写：只在bind和update时同时触发相同行为，传入一个函数即可

对象字面量：value支持对象
> 指令函数能够接受所有合法的 JavaScript 表达式。

### 渲染函数&JSX

render属性：
```javascript
render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
},
```

节点、树以及虚拟DOM：
```javascript
// @returns {VNode}
createElement(
  // {String | Object | Function}
  // 一个 HTML 标签名、组件选项对象，或者
  // resolve 了上述任何一种的一个 async 函数。必填项。
  'div',

  // {Object}
  // 一个与模板中属性对应的数据对象。可选。
  {
    // (详情见下一节)
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    '先写一些文字',
    createElement('h1', '一则头条'),
    createElement(MyComponent, {
      props: {
        someProp: 'foobar'
      }
    })
  ]
)
```

数据对象：
```javascript
{
  // 与 `v-bind:class` 的 API 相同，
  // 接受一个字符串、对象或字符串和对象组成的数组
  'class': {
    foo: true,
    bar: false
  },
  // 与 `v-bind:style` 的 API 相同，
  // 接受一个字符串、对象，或对象组成的数组
  style: {
    color: 'red',
    fontSize: '14px'
  },
  // 普通的 HTML 特性
  attrs: {
    id: 'foo'
  },
  // 组件 prop
  props: {
    myProp: 'bar'
  },
  // DOM 属性
  domProps: {
    innerHTML: 'baz'
  },
  // 事件监听器在 `on` 属性内，
  // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
  // 需要在处理函数中手动检查 keyCode。
  on: {
    click: this.clickHandler
  },
  // 仅用于组件，用于监听原生事件，而不是组件内部使用
  // `vm.$emit` 触发的事件。
  nativeOn: {
    click: this.nativeClickHandler
  },
  // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
  // 赋值，因为 Vue 已经自动为你进行了同步。
  directives: [
    {
      name: 'my-custom-directive',
      value: '2',
      expression: '1 + 1',
      arg: 'foo',
      modifiers: {
        bar: true
      }
    }
  ],
  // 作用域插槽的格式为
  // { name: props => VNode | Array }
  scopedSlots: {
    default: props => createElement('span', props.text)
  },
  // 如果组件是其它组件的子组件，需为插槽指定名称
  slot: 'name-of-slot',
  // 其它特殊顶层属性
  key: 'myKey',
  ref: 'myRef',
  // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
  // 那么 `$refs.myRef` 会变成一个数组。
  refInFor: true
} 
```

**约束：VNode必须是唯一的**

#### 使用js代替模板功能
- v-if 和 v-for
- v-model
- 事件 & 按键修饰符
- 插槽

对于 .passive、.capture 和 .once 这些事件修饰符, Vue 提供了相应的前缀可以用于 on:


修饰符 | 前缀 
- | -
.passive | &
.capture | !
.once | ~
.capture.once 或 .once.capture | ~!

```javascript
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

修饰符 | 处理函数中的等价操作
- | -
.stop | event.stopPropagation()
.prevent | event.preventDefault()
.self | if (event.target !== event.currentTarget) return
按键：.enter, .13 | if (event.keyCode !== 13) return (对于别的按键修饰符来说，可将 13 改为另一个按键码)
修饰键：.ctrl, .alt, .shift, .meta | if (!event.ctrlKey) return (将 ctrlKey 分别修改为 altKey、shiftKey 或者 metaKey)

```javascript
on: {
  keyup: function (event) {
    // 如果触发事件的元素不是事件绑定的元素
    // 则返回
    if (event.target !== event.currentTarget) return
    // 如果按下去的不是 enter 键或者
    // 没有同时按下 shift 键
    // 则返回
    if (!event.shiftKey || event.keyCode !== 13) return
    // 阻止 事件冒泡
    event.stopPropagation()
    // 阻止该元素默认的 keyup 事件
    event.preventDefault()
    // ...
  }
}
```

可以通过 this.$slots 访问静态插槽的内容，每个插槽都是一个 VNode 数组  
也可以通过 this.$scopedSlots 访问作用域插槽，每个作用域插槽都是一个返回若干 VNode 的函数  
如果要用渲染函数向子组件中传递作用域插槽，可以利用 VNode 数据对象中的 scopedSlots 字段  

#### JSX

JSX babel插件：https://github.com/vuejs/jsx

```javascript
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render: function (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

> 将 h 作为 createElement 的别名是 Vue 生态系统中的一个通用惯例，实际上也是 JSX 所要求的


#### 函数式组件

```javascript
Vue.component('my-component', {
  functional: true,
  // Props 是可选的
  props: {
    // ...
  },
  // 为了弥补缺少的实例
  // 提供第二个参数作为上下文
  render: function (createElement, context) {
    // ...
  }
})
```

```html
// 单文件组件
<template functional>
</template>
```

> 注意：在 2.3.0 之前的版本中，如果一个函数式组件想要接收 prop，则 props 选项是必须的。在 2.3.0 或以上的版本中，你可以省略 props 选项，所有组件上的特性都会被自动隐式解析为 prop。

组件需要的一切都是通过context提供：
- props
- children
- slots
- scopedSlots
- data
- parent
- listeners
- data.on
- injections

向子元素或子组件传递特性和事件：
```javascript
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // 完全透传任何特性、事件监听器、子节点等。
    return createElement('button', context.data, context.children)
  }
})
```

模板编译：`Vue.compile`

### 插件

Vue.use() 需要再调用new Vue()之前完成

会自动阻止多次注册相同插件，届时即使多次调用也只会注册一次该插件。

awesome-vue: https://github.com/vuejs/awesome-vue#components--libraries

#### 开发插件

暴露install方法，提供Vue构造器和可选的选项对象两个参数
```javascript
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

### 过滤器

过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”符号指示

```html
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```

全局定义:

```javascript
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

局部定义：filters选项

```javascript
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

当全局过滤器和局部过滤器重名时，会采用局部过滤器。

过滤器可以串联：{{ message | filterA | filterB }}

过滤器是 JavaScript 函数，因此可以接收参数：{{ message | filterA('arg1', arg2) }}


### 工具

#### 单文件组件

参见：https://cn.vuejs.org/v2/guide/single-file-components.html

#### 单元测试

参见：https://cn.vuejs.org/v2/guide/unit-testing.html

#### Typescript支持

参见：https://cn.vuejs.org/v2/guide/typescript.html

#### 生产环境部署

参见：https://cn.vuejs.org/v2/guide/deployment.html

### 规模化

#### 路由

参见：https://cn.vuejs.org/v2/guide/routing.html

#### 状态管理

参见：https://cn.vuejs.org/v2/guide/state-management.html

#### 服务端渲染

参见：https://cn.vuejs.org/v2/guide/ssr.html

### 内在（深入响应式原理）

参见：https://cn.vuejs.org/v2/guide/reactivity.html


## 想法

todo


## 实践过程

Vue无工程随手验证：https://github.com/ldc4/experiment/tree/master/vue-start

pinetodo（完善中）：https://github.com/ldc4/pinetodo/tree/master/client

工作中某个系统（vue + express + mysql）
