---
title: eggjs学习与实践
date: '2019-06-25 19:03:17'
category: '学习'
---

相关链接：
[官方文档（中文）](https://eggjs.org/zh-cn/intro/quickstart.html)
[Github](https://github.com/eggjs/egg/)

最近依赖别人的背景图片接口挂掉了，索性自己搭建一个nodejs服务来提供每日必应图。  
之前有看过koa2，做微信小程序有用过wafer2的server端。  
比较知名的还是eggjs，基于koa封装的企业级nodejs框架。  

<!-- more -->

## 学习笔记

eggjs继承于koa，所以很多内置对象和API都类似，建议可以先看看koa2

从 Koa 继承而来的 4 个对象（Application, Context, Request, Response) 以及框架扩展的一些对象（Controller, Service, Helper, Config, Logger）

### 内置对象

- Application    全局应用对象，继承自Koa.Application
- Context    一个请求级别的对象，继承自Koa.Context
- Request    一个请求级别的对象，继承自Koa.Request（封装了Node.js原生的HTTP Request对象）
- Response    一个请求级别的对象，继承自Koa.Response（封装了Node.js原生的HTTP Response对象）

#### app对象的获取
1. 继承于 Controller, Service, Helper 基类的实例中，this.ctx.app可以获取到app对象
2. 导出函数的第一个参数可以获取到app对象

#### ctx对象的获取
1. 继承于 Controller, Service, Helper 基类的实例中，this.ctx可以获取到ctx对象
2. Middleware，Schedule函数的第一个参数可以获取到ctx对象
3. Application.createAnonymousContext()可以创建一个匿名ctx对象

#### request对象的获取
- 继承于 Controller, Service, Helper 基类的实例中，this.ctx.request 可以获取到

#### response对象的获取
- 继承于 Controller, Service, Helper 基类的实例中，this.ctx.response 可以获取到

注：`ctx.response.body = ctx.body`，而`ctx.request.body`是获取POST方法的请求体

### 框架对象

- Controller，Service类包含属性：ctx，app，config，service，logger  
- Helper 用来提供一些实用的 utility 函数  
- Config 推荐应用开发遵循配置和代码分离的原则  
- Logger 四个级别：debug/info/warn/error  
- Subscription 订阅模型，可用于创建定时任务

### 运行环境

- 通过config/env文件指定
- 通过 EGG_SERVER_ENV 环境变量指定

获取运行环境：app.config.env

一般项目开发流程包含：本地开发、测试环境、生产环境，可以通过运行环境变量来做一些跟环境有关的逻辑判断

### 配置（Config）

会根据环境读取不同的js配置

支持导出对象和函数，函数包含appInfo参数：
  > pkg: package.json  
  > name: 应用名，同pkg.name  
  > baseDir: 应用代码的目录  
  > HOME: 用户目录，如 admin 账户为 /home/admin  
  > root: 应用根目录，只有在 local 和 unittest 环境下为 baseDir，其他都为 HOME。  

加载优先级：应用 > 框架 > 插件

注：数据库密码和云上SecretKey等，一定不要提交到github上

### 中间件（Middleware）

放置在app/middleware目录下的单独文件，需要exports一个普通函数，接收两个参数：
  > options: 中间件的配置项，框架会将app.config[${middlewareName}]传递进来  
  > app: 当前应用的app对象

- 框架默认中间件：如果应用层有自定义同名中间件，在启动时会报错。
- 使用Koa的中间件：如果不符合egg的middleware规范，则需要自行处理


#### 示例

``` javascript
const isJSON = require('koa-is-json');
const zlib = require('zlib');

module.exports = options => {
  return async function gzip(ctx, next) {
    await next();
  
    let body = ctx.body;
    if (!body) return;

    if (options.threshold && ctx.length < options.threshold) return;

    if (isJSON(body)) body = JSON.stringify(body);
    
    const stream = zlib.createGzip();
    stream.end(body);
    ctx.body = stream;
    ctx.set('Content-Encoding', 'gzip');
  }
}
```

#### 在应用中使用

在config.default.js中配置对应中间件，通用的配置项：enable，match，ignore

``` javascript
module.exports = {
  // 配置需要的中间件，数组顺序即为中间件的加载顺序
  middleware: [ 'gzip' ],

  // 配置 gzip 中间件的配置
  gzip: {
    threshold: 1024, // 小于 1k 的响应体不压缩
  },
};
```

#### 在框架和插件中使用

``` javascript
// app.js
module.exports = app => {
  app.config.coreMiddleware.unshift('gzip');
};
```

框架和插件不支持在 config.default.js 中匹配 middleware

应用层定义的中间件（app.config.appMiddleware）

框架默认中间件（app.config.coreMiddleware）

#### 在路由中使用

``` javascript
module.exports = app => {
  const gzip = app.middleware.gzip({ threshold: 1024 });
  app.router.get('/needgzip', gzip, app.controller.handler);
};
```

### 路由（Router）

``` javascript
router.verb('path-match', app.controller.action);
router.verb('router-name', 'path-match', app.controller.action);
router.verb('path-match', middleware1, ..., middlewareN, app.controller.action);
router.verb('router-name', 'path-match', middleware1, ..., middlewareN, app.controller.action); 
```

- verb: head, options, get, post, put, post, patch, delete, del, redirect
- router-name: 路由的别名，可以通过 Helper 提供的辅助函数 pathFor 和 urlFor 来生成 URL
- path-match: 路由的URL路径
- middleware: 中间件（可以配置多个）
- controller: 控制器（引用app.controller.user.fetch 或 字符串'user.fetch'）

动态路由参数获取：ctx.params  
内部重定向：router.redirect  
外部重定向：ctx.redirect  

### 控制器（Controller）

controller负责解析用户的输入，处理后返回相应的结果  
编写controller类继承至egg.Controller，包含内置属性：ctx、app、service、config、logger

- 获取请求参数：ctx.query | ctx.queries (没有过滤相同的key) 
- 获取header: ctx.get('xxx') | ctx.header | ctx.headers
- 获取cookies: ctx.cookies | ctx.cookies.get('xxx') | ctx.cookies.set('yyy')
- 获取session: ctx.session

### 服务（Service）

service是在复杂业务场景下用于做业务逻辑封装的一个抽象层  
编写service类继承至egg.Serivce，包含内置属性：ctx、app、service、config、logger  

### 插件（Plugin）

使用方式：
1. 安装对应的插件NPM包
2. 在config/plugin.js中添加配置
3. 在业务逻辑中，使用插件提供的功能

plugin.js配置包含：enable、package、path、env  
可以通过plugin.{env}.js来区分不同环境使用哪些插件  

框架默认插件：
onerror
Session
i18n
watcher
multipart
security
development
logrotator
schedule
static
jsonp
view

### 定时任务（Schedule）

继承至egg.Subscription类：
- schedule属性来设置定时任务配置
- subscribe()方法即是被定时任务执行的方法

定时方式：interval | cron  
类型：worker | all  

#### 示例

``` javascript
const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1m', // 1 分钟间隔
      type: 'all', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const res = await this.ctx.curl('http://www.api.com/cache', {
      dataType: 'json',
    });
    this.ctx.app.cache = res.data;
  }
}

module.exports = UpdateCache;
```

#### 缩写

``` javascript
module.exports = {
  schedule: {
    interval: '1m', // 1 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task(ctx) {
    const res = await ctx.curl('http://www.api.com/cache', {
      dataType: 'json',
    });
    ctx.app.cache = res.data;
  },
};
```

执行日志：执行日志会输出到 ${appInfo.root}/logs/{app_name}/egg-schedule.log，默认不会输出到控制台，可以通过 config.customLogger.scheduleLogger 来自定义。

手动执行定制任务：`app.runSchedule(path)`

## 实践过程

coming soon...
