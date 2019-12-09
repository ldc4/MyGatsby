---
title: 实现Diff页面的工程实践
date: '2019-11-22 14:41:07'
category: '实践'
tags: ['diff']
---

对项目中重要的实体（特别是配置类的实体）添加上版本的概念，是一个常规操作。  
有了版本就会有版本间的对比，对比是体现在数据结构上的。当然，同构的对比才有意义。  
而最终呈现在页面上的就是字符串，字符串与字符串的对比，被称为文本对比。  
所以实现一个diff页面的本质就是：数据结构对比和文本对比。  

<!-- more -->

## 介绍

先介绍两个库：[jsdiff](https://github.com/kpdecker/jsdiff) 和 [diff2html](https://github.com/rtfpessoa/diff2html)  

### jsdiff

jsdiff: A javascript text differencing implementation.  

jsdiff提供一些对比字符串的工具方法

示例代码：https://jsfiddle.net/ldc4/prxm13sb/  
官方实例：http://incaseofstairs.com/jsdiff/

关于文本对比的经典算法：Myers，就不过多介绍了（图DP搜索）。  
算法部分可以自行学习: [【Git 是怎样生成 diff 的：Myers 算法】](https://cjting.me/2017/05/13/how-git-generate-diff/)

### diff2html

diff2html: generates pretty HTML diffs from git or unified diff output.

diff2html在js基于unified diff格式和git diff格式，支持line-by-line和side-by-side的对比。

由于diff2html对外提供的方法getPrettyHtml是通过diff格式直接生成渲染的HTML，主要使用场景是用在文本文件的对比展示。

示例代码：https://jsfiddle.net/ldc4/37o6p18x/  
官方实例：https://diff2html.xyz/

## Diff格式

阮神的[【读懂diff】](http://www.ruanyifeng.com/blog/2012/08/how_to_read_diff.html)，介绍了一下diff结果的格式  
*nix系统中diff以及git的diff，主要是对比文本文件，得到一个文本对比结果。

### Unified Diff

```
　　--- f1 2012-08-29 16:45:41.000000000 +0800
　　+++ f2 2012-08-29 16:45:51.000000000 +0800
　　@@ -1,7 +1,7 @@
　　 a
　　 a
　　 a
　　-a
　　+b
　　 a
　　 a
　　 a
```

### Git Diff

```
　　diff --git a/f1 b/f1
　　index 6f8a38c..449b072 100644
　　--- a/f1
　　+++ b/f1
　　@@ -1,7 +1,7 @@
　　 a
　　 a
　　 a
　　-a
　　+b
　　 a
　　 a
　　 a
```

## 如何生成Diff页面

然而我们仅仅是想要得到一个diff结果，所以将diff2html中的一些通用方法进行拼装

通过约定一个数据结构的diffType字段，以及文本内添加`<ins>`和`</del>`标记，再加上公共样式，得到一个拥有diff效果的页面

### diff约定

1. 进行数据结构对比，对每一个对象添加一个diffType字段。
   > diffType字段值为'diff-ins' | 'diff-del' | 'diff-change'
2. 若是对比的每一项是基础类型，而不是对象，则提供同构diff字段。
   > 例如：['a', 'b'] -> ['b', 'c']，则diff结果值为：['a', 'b', 'c']，diff字段值为 ['-', '$nbsp;', '+']
3. 进行文本对比，新增的文本用`<ins>`包裹，删除的文本用`</del>`包裹

### 改造的diff方法

在diff2html基础上提供了两个帮助函数（diff-helper.js）：  
- getPrettyDiff    // 多行对比
- getNormalDiff    // 字符串对比

通过对比ID来判断对象是否发生改变，ID也可以当做一个字符串  

因此，所有的结构都可以生成一个字符串数组  

### diff方法论

宗旨：**万物若同构，皆可diff**

片头提到：“实现一个diff页面的本质就是：数据结构对比和文本对比。 ” 

文本对比：采用Myers算法进行对比即可  
数据结构对比：可以一层一层降维对比，但一般来说平面最常见的也就二维数据结构

#### 针对一维数组（列表）的对比

1. 提取出能唯一标识对象的字段值（通常为ID属性），构造格式化的参数
  ```javascript
  {
      id: 'xxx',
      label: 'xxx',   // 比对的内容（会应用字符串比对）
      number: 1       // 索引
  }
  ```

2. 调用getPrettyDiff函数进行对比，得到对比差异结果对象
  ```javascript
  {
      id: 'xxx',
      content: 'xxx'      // 包含差异结果的label
      cNumber: 1          // 原索引
      prefix: '+'         // 差异类型：新增 + 删除 - 不变  
      oldNumber: null     // 原行号（从1开始），null标识原本没有
      newNumber: 2        // 新行号（从1开始），null标识被删除了
  }
  ```
3. 通过判断prefix，可以在比对的新旧数据，根据oldNumber，newNumber拿到对应的数据，生成最终同构的对比结果

#### 针对二维数组（表格）的对比

1. 根据一维数组的方法，对比列差异
2. 根据一维数组的方法，对比行差异
3. 根据行列差异情况，扩展新旧二维数组，并做状态标识
4. 比对新旧二维数组的每一个单元格的状态标识，判断是否是发生改变的情况，然后对比单元格内容
5. 如果单元格是字符串，则直接应用字符串对比函数（getNormalDiff）
6. 如果单元格是格式化结构，则再走一/二维数组的对比流程
 
三维及更多维的情况则更加复杂


## 具体实现

comming...




