---
title: 虚拟列表/树
date: '2019-11-15 09:23:32'
category: '实践'
tags: ['虚拟列表', '虚拟树']
draft: true
---

任何极端情况下，都存在性能优化。  
页面上DOM只要一多，即便是性能怪兽的V8也会卡。  
本案例的本质就是局部可见是有限的，可以限制在不卡的范围。  

<!-- more -->

## 介绍

树形结构经常会在开发中用到，不过渲染在页面上，本质上也是列表（拍平的树）。

关于列表的加载和渲染：
![](https://xmind-1251945389.cos.ap-guangzhou.myqcloud.com/1.png)

如果一次性加载数据的接口耗时过长，建议还是将加载的压力分解在时间上，即懒分页。  
如果不得不全量加载，但是数据量不算太多，可以直接全量渲染。  
但在有的场景下，不得不一次性全量加载，如果加载的数据项过多，页面就会存在卡顿，这就是我们所谓的长列表。  


长列表：无法通过分页方式来加载的数量大到一次渲染导致页面卡顿的列表

解决方案：时间分片，虚拟列表

> 网上已经存在很多关于这类解决方案的文章和库，有兴趣的可以阅读一下，我下面罗列的系列文章

## 参考资料

从时间线列举了一些跟虚拟列表有关的文章和库

[React Virtualized](https://github.com/bvaughn/react-virtualized) | 
[Vue Virtual Scroll](https://github.com/Akryum/vue-virtual-scroller)

[Complexities of an Infinite Scroller](https://developers.google.com/web/updates/2016/07/infinite-scroller)  
by developers.google.com/web

[Infinite List and React](https://itsze.ro/blog/2017/04/09/infinite-list-and-react.html)  
by itsze.ro/blog

[聊聊前端开发中的长列表](https://zhuanlan.zhihu.com/p/26022258)  
by 知乎专栏 - Furybean

[再谈前端虚拟列表的实现](https://zhuanlan.zhihu.com/p/34585166)  
by 知乎专栏 - Furybean

[浅说虚拟列表的实现原理](https://github.com/dwqs/blog/issues/70)  
by github - dwqs

[「前端进阶」高性能渲染十万条数据(时间分片)](https://juejin.im/post/5d76f469f265da039a28aff7)  
by 掘金 - 云中桥

[「前端进阶」高性能渲染十万条数据(虚拟列表)](https://juejin.im/post/5db684ddf265da4d495c40e5)  
by 掘金 - 云中桥

## 实际场景

技术栈：vue + element-ui

场景：有一个复杂度很高的树，但需要一次性加载并展开全部，并根据关键字找到想要的内容，再进行下钻处理其他东西

先来看看Element的tree组件的性能：
https://jsfiddle.net/ldc4/8v934a27/3/

构造 20 x 20 x 20 的树，全部展开，需要4s

生产中，这是不能接受的。

但是，如果我们采用虚拟列表来优化，带来的影响有几点：
1. 需要将层级结构从树结构变成列表
2. 需要自行添加搜索关键字功能（不能使用浏览器自带的ctrl+f，因为不在可视区的没有渲染）
3. 基于第1点，需要舍弃tree组件，根据数据自行渲染，并实现缩进/展开/折叠等功能

element-ui旨在给大多数场景提供一个统一的组件，但是像一些高性能场景下考虑得较少。

> **为什么可视区渲染有虚拟列表，而没有虚拟树？**  
  首先，虚拟列表的场景也是有限的，一般用于能够知道每项高度的列表。而且不等高的，只能预设一个平均高度，如果极端情况下，也还是会存在问题。  
  Element的tree组件的底层实现是树结构的DOM，状态和DOM是同构的，这里虽然提高了树操作逻辑的性能，但是就没办法做可视区渲染了。  
  极端情况下，树就一个根节点，你展开所有，当跟节点离开可视区的时候，你要怎么销毁这个跟节点的DOM?  
  同样，如果有多个根节点，你把包含根节点的子树当成一个节点，这不就相当于虚拟列表么，但是你需要去计算子树的所有节点加起来的高度。如果可视区的计算逻辑复杂性非常大，就算实现出来，也有可能是卡顿的。  
  所以，更通用的还是虚拟列表，你需要把树结构拍平成数组，然后再应用虚拟列表来优化

## 虚拟树的实现

> 所以这里所说的虚拟树是指：结构是树形结构，但是渲染依然是列表，只是通过缩进来表示了层级结构
> 这里我提供一下虚拟树的实现，虚拟列表参考上面的文章即可

组件源码：https://github.com/ldc4/experiment/blob/master/element/demo/src/components/VirtualTree/VirtualTree.vue  
使用源码：https://github.com/ldc4/experiment/blob/master/element/demo/src/views/VirtualTree.vue

下面是组件的代码，从项目中抽出来的最小集，做为一个demo引子，不保证完全可用性，有需要的可以自行改造。

```javascript
<template>
  <div class="virtual-tree" :style="{ height: option.visibleHeight + 'px' }" @scroll="handleScroll">
    <div class="vt-phantom" :style="{ height: contentHeight + 'px' }"></div>
    <div ref="content" class="vt-content" :style="{ transform: `translateY(${offset}px)` }">
      <div
        v-for="(item, index) in visibleData"
        :key="item.id"
        :level="item.level"
        :class="{
          'vt-item': true,
          'item-selected': item.select,
          ...(itemProps(item).class || {})
        }"
        :style="{
          lineHeight: option.itemHeight + 'px',
          height: option.itemHeight + 'px',
          paddingLeft: indent * (item.level - 1) + 40 + 'px',
          ...(itemProps(item).style || {})
        }"
        v-bind="itemProps(item)"
        @click="nodeClick(item)"
      >
        <i
          class="virtual-tree-icon"
          :class="item.expand ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
          @click="toggleExpand($event, item, index)"
          v-if="item.children && item.children.length"
        ></i>
        <slot :item="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'VirtualTree',
  model: {
    prop: 'tree',
    event: 'update'
  },
  props: {
    tree: {                   // 树的数据源（树形结构）
      type: Array,
      required: true
    },
    defaultExpand: {          // 是否默认展开
      type: Boolean,
      required: false,
      default: false
    },
    option: {                 // 配置对象
      type: Object,
      required: true,
      // default: {
      //   visibleHeight: 0,     // 可视区域的高度
      //   itemHeight: 25,       // 单个item的高度

      //   // 若滚动元素不是自身，需要提供下面两个属性

      //   flexHeight: 0,        // 顶部浮动的高度
      //   scrollDom: null       // 滚动元素的节点
      // }
    },
    itemProps: {              // item属性扩展
      type: Function,
      required: false,
      default: () => ({})
    }
  },
  data() {
    return {
      flexCount: 20,          // 修正个数
      indent: 18,             // 缩进
      offset: 0,              // translateY偏移量
      visibleData: [],        // 可视数据列表
      contentHeight: 0,       // 容器高度
    }
  },
  computed: {
    flattenTree() {
      const flatten = (tree, list = [], level = 0, parent = { children: tree }) => {
        if (tree && (tree instanceof Array)) {
          ++level;
          tree.forEach((item) => {
            if (item.expand === undefined) {
              item.expand = this.defaultExpand
            }
            if (item.visible === undefined) {
              if (this.defaultExpand || level === 1) {
                item.visible = true
              } else {
                item.visible = false
              }
            }
            item.level = level;
            item.parent = parent
            list.push(item)
            if (item.children) {
              flatten(item.children, list, level, item)
            }
          })
        }
        return list
      }
      return flatten(this.tree)
    }
  },
  mounted() {
    this.updateView()
    window.addEventListener('resize', this.resize)
  },
  methods: {
    // 处理滚动
    handleScroll() {
      // 如果当前滚动元素不是当前组件，则需要传入scrollDom
      if (this.option.scrollDom) {
        const scrollTop = this.option.scrollDom.scrollTop
        const diff = scrollTop - (this.$el.offsetTop - this.option.flexHeight)
        this.updateVisibleData(diff > 0 ? diff : 0)
      } else {
        const scrollTop = this.$el.scrollTop <= this.contentHeight ? this.$el.scrollTop : this.contentHeight
        this.updateVisibleData(scrollTop)
      }
    },
    // 更新可视数据
    updateVisibleData(scrollTop = 0) {
      console.log(scrollTop)
      const that = this
      const visibleHeight = this.option.visibleHeight ? this.option.visibleHeight : this.$el.clientHeight
      const flexCount = this.option.flexCount ? this.option.flexCount : this.flexCount
      const start = Math.floor(scrollTop / this.option.itemHeight)
      const end = start + Math.ceil(visibleHeight / this.option.itemHeight) + flexCount
      const allVisibleData = (this.flattenTree || []).filter(item => item.visible)
      that.visibleData = allVisibleData.slice(start, end)
      that.offset = start * that.option.itemHeight
      this.$nextTick(() => {
        // 避免动画渲染问题
        that.$emit('update-visible-data', { visibleData: that.visibleData, offset: that.offset })
      })
    },
    // 更新容器高度
    updateContentHeight() {
      this.contentHeight = (this.flattenTree || []).filter(item => item.visible).length * this.option.itemHeight
    },
    // 窗口变化，需要做的处理
    resize(duration) {
      if (!this.timer) {
        // 避免频繁触发
        this.timer = true
        const that = this
        setTimeout(function() {
          that.$emit('resize')
          that.handleScroll()
          that.timer = false
        }, duration)
      }
    },
    // 强制刷新
    updateView() {
      const that = this
      this.updateContentHeight()
      this.$emit('update', this.tree)
      this.$nextTick(() => {
        that.handleScroll()
      })
    },
    // 点击节点
    nodeClick(item) {
      const recursionSelect = function(children, value) {
        children &&
          children.forEach(node => {
            node.select = value
            recursionSelect(node.children, value)
          })
      }
      recursionSelect(this.flattenTree, false)
      recursionSelect([item], true)
      this.updateView()
      this.$emit('node-click', item)
    },
    // 展开全部
    toggleExpandAll(state, level = 1) {
      const that = this
      let expandNodes = [] // 待展开/折叠的节点
      let rootNodes = [] // 父级节点（直到根节点）
      // 1. 找到对应节点
      this.flattenTree.forEach(item => {
        if (item.level === level) {
          expandNodes.push(item)
        }
        if (item.level < level) {
          rootNodes.push(item)
        }
      })
      // 2. 展开/折叠节点
      expandNodes.forEach(item => {
        if (state) {
          that.expand(item, false)
        } else {
          that.collapse(item, false)
        }
      })
      // 3.展开父级节点
      rootNodes.forEach(item => {
        that.expand(item, true)
      })
      this.updateView()
    },
    // 切换节点展开/折叠
    toggleExpand(e, item, index) {
      e && e.stopPropagation()
      const isExpand = item.expand
      if (isExpand) {
        this.collapse(item, true) // 折叠
      } else {
        this.expand(item, true) // 展开
      }
      this.updateView()
      !isExpand && this.$emit('node-expand', e, item, index)
    },
    // 展开节点
    expand(item, isKeep = true) {
      const recursionVisible = function(children) {
        children.forEach(node => {
          if (!isKeep) {
            node.expand = true
          }
          node.visible = true
          if (node.expand && node.children) {
            recursionVisible(node.children)
          }
        })
      }
      item.expand = true
      item.children &&
        item.children.forEach(node => {
          if (!isKeep) {
            node.expand = true
          }
          node.visible = true
          node.expand && node.children && recursionVisible(node.children)
        })
    },
    // 折叠节点
    collapse(item, isKeep = true) {
      const recursionVisible = function(children) {
        children.forEach(node => {
          if (!isKeep) {
            node.expand = false
          }
          node.visible = false
          if (node.children) {
            recursionVisible(node.children)
          }
        })
      }
      item.expand = false
      item.children && recursionVisible(item.children)
    },

    /** 对树节点的操作 **/

    // 添加子节点
    append(item, parent) {
      if (!parent.children) {
        this.$set(parent, 'children', [])
      }
      parent.children.push(item)
      this.updateView()
    },
    // 添加兄弟节点
    insertAfter(item, node, isUpdate = true) {
      const index = node.parent.children.indexOf(node)
      node.parent.children.splice(index + 1, 0, item)
      isUpdate && this.updateView()
    },
    // 删除节点
    remove(item) {
      if (item.parent) {
        const index = item.parent.children.indexOf(item)
        item.parent.children.splice(index, 1)
        this.updateView()
      }
    }
  }
}
</script>

<style scoped>
.virtual-tree {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.vt-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
.vt-content {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  min-height: 100px;
}
.vt-item {
  padding: 5px;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
  cursor: pointer;
}
.vt-item:hover, .item-selected {
  background-color: #d7d7d7;
}
.virtual-tree-icon {
  position: absolute;
  left: 0;
  color: #c0c4cc;
  z-index: 10;
}
</style>
```

