---
title: 重拾Webpack
date: '2019-07-09 09:21:42'
category: '学习'
---

相关链接：
[官方文档（中文）](https://www.webpackjs.com/guides/)
[深入浅出Webpack](http://webpack.wuhaolin.cn/)

每搭建一个项目，都会用到的东西就是构建工具，每次搭建完，就基本上不会去修改了。  
但每次手动搭建，似乎都会存在各种奇葩的问题，因为构建工具的版本迭代还是非常快的。  
尽管webpack的文档是如此详细，但还是会踩到一些坑。  
在这种间歇性一次性使用情况下，配置项经常搞忘。  

<!-- more -->

### 基本概念

#### 构建工具做的事情

工程化、自动化思想在前端开发中的体现

- 代码转换：转换成可执行代码
- 文件优化：文件压缩
- 代码分割：模块化
- 模块合并：减少请求
- 自动刷新：监听代码变更
- 代码校验：代码规范和单元测试
- 自动发布：持续集成

#### 6个核心概念
- Entry：入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块转换器，用于把模块原内容按照需求转换成新内容。
- Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。
- Output：输出结果，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果。 

#### 处理流程

- Webpack 启动后会从 Entry 里配置的 Module 开始递归解析 Entry 依赖的所有 Module。  
- 每找到一个 Module， 就会根据配置的 Loader 去找出对应的转换规则，对 Module 进行转换后，再解析出当前 Module 依赖的 Module。  
- 这些模块会以 Entry 为单位进行分组，一个 Entry 和其所有依赖的 Module 被分到一个组也就是一个 Chunk。  
- 最后 Webpack 会把所有 Chunk 转换成文件输出。  
- 在整个流程中 Webpack 会在恰当的时机执行 Plugin 里定义的逻辑。   

### 配置简介

#### 示例

```javascript
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: true } },
          { loader: 'postcss-loader' },
          { loader: 'less-loader' }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head',
      minify: {
        collapseWhitespace: true
      }
    })
  ]
};
```

#### Loader的使用

module.rules可以配置一组规则：{ test, use }  
test: 匹配的正则  
use: 采用的loader数组，从后到前的顺序执行loader  

也可以通过import采用内联的写法: (不推荐)
`import Styles from 'style-loader!css-loader?modules!./styles.css';`


#### Plugin的使用

插件列表：https://www.webpackjs.com/plugins/

安装需要的插件，然后在plugins里面使用即可，需要注意阅读插件官方文档来确认用法。


#### 开发过程中

开发的时候会用webpack-dev-server、devtool等配置，方便开发调试。  
配置文件最好区分一下环境，抽取公共配置，通过webpack-merge来合并。  

```javascript
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
});
```

注意使用webpack-dev-server与webpack的版本对应  
webpack-dev-server2.x对应webpack3.x  
webpack-dev-server3.x对应webpack4.x  


### 配置详解

#### 示例

```javascript
const path = require('path');

module.exports = {
  // entry 表示 入口，Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入。
  // 类型可以是 string | object | array   
  entry: './app/entry', // 只有1个入口，入口只有1个文件
  entry: ['./app/entry1', './app/entry2'], // 只有1个入口，入口有2个文件
  entry: { // 有2个入口
    a: './app/entry-a',
    b: ['./app/entry-b1', './app/entry-b2']
  },

  // 如何输出结果：在 Webpack 经过一系列处理后，如何输出最终想要的代码。
  output: {
    // 输出文件存放的目录，必须是 string 类型的绝对路径。
    path: path.resolve(__dirname, 'dist'),

    // 输出文件的名称
    filename: 'bundle.js', // 完整的名称
    filename: '[name].js', // 当配置了多个 entry 时，通过名称模版为不同的 entry 生成不同的文件名称
    filename: '[chunkhash].js', // 根据文件内容 hash 值生成文件名称，用于浏览器长时间缓存文件

    // 发布到线上的所有资源的 URL 前缀，string 类型
    publicPath: '/assets/', // 放到指定目录下
    publicPath: '', // 放到根目录下
    publicPath: 'https://cdn.example.com/', // 放到 CDN 上去

    // 导出库的名称，string 类型
    // 不填它时，默认输出格式是匿名的立即执行函数
    library: 'MyLibrary',

    // 导出库的类型，枚举类型，默认是 var
    // 可以是 umd | umd2 | commonjs2 | commonjs | amd | this | var | assign | window | global | jsonp ，
    libraryTarget: 'umd', 

    // 是否包含有用的文件路径信息到生成的代码里去，boolean 类型
    pathinfo: true, 

    // 附加 Chunk 的文件名称
    chunkFilename: '[id].js',
    chunkFilename: '[chunkhash].js',

    // JSONP 异步加载资源时的回调函数名称，需要和服务端搭配使用
    jsonpFunction: 'myWebpackJsonp',

    // 生成的 Source Map 文件名称
    sourceMapFilename: '[file].map',

    // 浏览器开发者工具里显示的源码模块名称
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]',

    // 异步加载跨域的资源时使用的方式
    crossOriginLoading: 'use-credentials',
    crossOriginLoading: 'anonymous',
    crossOriginLoading: false,
  },

  // 配置模块相关
  module: {
    rules: [ // 配置 Loader
      {  
        test: /\.jsx?$/, // 正则匹配命中要使用 Loader 的文件
        include: [ // 只会命中这里面的文件
          path.resolve(__dirname, 'app')
        ],
        exclude: [ // 忽略这里面的文件
          path.resolve(__dirname, 'app/demo-files')
        ],
        use: [ // 使用那些 Loader，有先后次序，从后往前执行
          'style-loader', // 直接使用 Loader 的名称
          {
            loader: 'css-loader',      
            options: { // 给 html-loader 传一些参数
            }
          }
        ]
      },
    ],
    noParse: [ // 不用解析和处理的模块
      /special-library\.js$/  // 用正则匹配
    ],
  },

  // 配置插件
  plugins: [
  ],

  // 配置寻找模块的规则
  resolve: { 
    modules: [ // 寻找模块的根目录，array 类型，默认以 node_modules 为根目录
      'node_modules',
      path.resolve(__dirname, 'app')
    ],
    extensions: ['.js', '.json', '.jsx', '.css'], // 模块的后缀名
    alias: { // 模块别名配置，用于映射模块
       // 把 'module' 映射 'new-module'，同样的 'module/path/file' 也会被映射成 'new-module/path/file'
      'module': 'new-module',
      // 使用结尾符号 $ 后，把 'only-module' 映射成 'new-module'，
      // 但是不像上面的，'module/path/file' 不会被映射成 'new-module/path/file'
      'only-module$': 'new-module', 
    },
    alias: [ // alias 还支持使用数组来更详细的配置
      {
        name: 'module', // 老的模块
        alias: 'new-module', // 新的模块
        // 是否是只映射模块，如果是 true 只有 'module' 会被映射，如果是 false 'module/inner/path' 也会被映射
        onlyModule: true, 
      }
    ],
    symlinks: true, // 是否跟随文件软链接去搜寻模块的路径
    descriptionFiles: ['package.json'], // 模块的描述文件
    mainFields: ['main'], // 模块的描述文件里的描述入口的文件的字段名称
    enforceExtension: false, // 是否强制导入语句必须要写明文件后缀
  },

  // 输出文件性能检查配置
  performance: { 
    hints: 'warning', // 有性能问题时输出警告
    hints: 'error', // 有性能问题时输出错误
    hints: false, // 关闭性能检查
    maxAssetSize: 200000, // 最大文件大小 (单位 bytes)
    maxEntrypointSize: 400000, // 最大入口文件大小 (单位 bytes)
    assetFilter: function(assetFilename) { // 过滤要检查的文件
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  devtool: 'source-map', // 配置 source-map 类型

  context: __dirname, // Webpack 使用的根目录，string 类型必须是绝对路径

  // 配置输出代码的运行环境
  target: 'web', // 浏览器，默认
  target: 'webworker', // WebWorker
  target: 'node', // Node.js，使用 `require` 语句加载 Chunk 代码
  target: 'async-node', // Node.js，异步加载 Chunk 代码
  target: 'node-webkit', // nw.js
  target: 'electron-main', // electron, 主线程
  target: 'electron-renderer', // electron, 渲染线程

  externals: { // 使用来自 JavaScript 运行环境提供的全局变量
    jquery: 'jQuery'
  },

  stats: { // 控制台输出日志控制
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },

  devServer: { // DevServer 相关的配置
    proxy: { // 代理到后端服务接口
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // 配置 DevServer HTTP 服务器的文件根目录
    compress: true, // 是否开启 gzip 压缩
    historyApiFallback: true, // 是否开发 HTML5 History API 网页
    hot: true, // 是否开启模块热替换功能
    https: false, // 是否开启 HTTPS 模式
    },

    profile: true, // 是否捕捉 Webpack 构建的性能信息，用于分析什么原因导致构建性能不佳

    cache: false, // 是否启用缓存提升构建速度

    watch: true, // 是否开始
    watchOptions: { // 监听模式选项
    // 不监听的文件或文件夹，支持正则匹配。默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为300ms 
    aggregateTimeout: 300,
    // 判断文件是否发生变化是不停的去询问系统指定文件有没有变化，默认每秒问 1000 次
    poll: 1000
  },
}
```

#### Entry

context属性：Webpack 在寻找相对路径的文件时会以 context 为根目录，context 默认为执行启动 Webpack 时所在的当前工作目录。

| 类型 | 例子 | 含义 |
| --- | --- | --- |
| string | './app/entry' | 入口模块的文件路径，可以是相对路径。|
| array | ['./app/entry1', './app/entry2'] | 入口模块的文件路径，可以是相对路径。|
| object | { a: './app/entry-a', b: ['./app/entry-b1', './app/entry-b2']} | 配置多个入口，每个入口生成一个 Chunk |

entry属性：可以是 string | array | object 三种方式

chunk名称：Webpack 会为每个生成的 Chunk 取一个名称  
> 如果 entry 是一个 string 或 array，就只会生成一个 Chunk，这时 Chunk 的名称是 main；  
> 如果 entry 是一个 object，就可能会出现多个 Chunk，这时 Chunk 的名称是 object 键值对里键的名称。  

entry通过设置函数，可以动态设置入口文件。

#### Output

filename属性：配置输出文件的名称，包含一些内置的模板变量

| 变量名 | 含义 |
| --- | --- |
| id | Chunk 的唯一标识，从0开始 |
| name | Chunk 的名称 |
| hash | Chunk 的唯一标识的 Hash 值 |
| chunkhash | Chunk 内容的 Hash 值 |

例如 filename: '[name].[hash].js';

另外还有一个chunkFilename:  
output.chunkFilename 配置无入口的 Chunk 在输出时的文件名称。  
chunkFilename 和上面的 filename 非常类似，但 chunkFilename 只用于指定在运行过程中生成的 Chunk 在输出时的文件名称。  
常见的会在运行时生成 Chunk 场景有在使用 CommonChunkPlugin、使用 import('path/to/module') 动态加载等时。  
chunkFilename 支持和 filename 一致的内置变量。  

path属性：配置输出文件存放在本地的目录，必须是 string 类型的绝对路径。

publicPath属性：配置发布到线上资源的 URL 前缀，为string 类型。 默认值是空字符串 ''，即使用相对路径。
```
publicPath: "https://cdn.example.com/assets/", // CDN（总是 HTTPS 协议）
publicPath: "//cdn.example.com/assets/", // CDN (协议相同)
publicPath: "/assets/", // 相对于服务(server-relative)
publicPath: "assets/", // 相对于 HTML 页面
publicPath: "../assets/", // 相对于 HTML 页面
publicPath: "", // 相对于 HTML 页面（目录相同）
```

path和publicPath只支持[hash]模板变量

crossOriginLoading属性：用于配置异步插入的`<script>`标签的 crossorigin 值。  
Webpack 输出的部分代码块可能需要异步加载，而异步加载是通过 JSONP 方式实现的。  
JSONP 的原理是动态地向 HTML 中插入一个 `<script src="url"></script>` 标签去加载异步资源。  
script 标签的 crossorigin 属性可以取以下值：
> anonymous(默认) 在加载此脚本资源时不会带上用户的 Cookies；  
> use-credentials 在加载此脚本资源时会带上用户的 Cookies。

当用 Webpack 去构建一个可以被其他模块导入使用的库时需要用到它们：
> libraryTarget属性：配置以何种方式导出库  
> library属性：配置导出库的名称

#### Module

rules属性：配置模块的读取和解析规则，通常用来配置 Loader  
> 条件匹配：通过 test 、 include 、 exclude 三个配置项来命中 Loader 要应用规则的文件。  
> 应用规则：对选中后的文件通过 use 配置项来应用 Loader，可以只应用一个 Loader 或者按照从后往前的顺序应用一组 Loader，同时还可以分别给 Loader 传入参数。  
> 重置顺序：一组 Loader 的执行顺序默认是从右到左执行，通过 enforce 选项可以让其中一个 Loader 的执行顺序放到最前或者最后。   

noParse属性：可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。

#### Resolve

Webpack 在启动后会从配置的入口模块出发找出所有依赖的模块，Resolve 配置 Webpack 如何寻找模块所对应的文件

alias属性: 配置项通过别名来把原导入路径映射成一个新的导入路径。

extensions属性：在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。

modules属性：配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去 node_modules 目录下寻找。

#### Plugin

plugins 配置项接受一个数组，数组里每一项都是一个要使用的 Plugin 的实例，Plugin 需要的参数通过构造函数传入。


#### DevServer

hot属性：模块热替换功能

inline属性：DevServer 的实时预览功能依赖一个注入到页面里的代理客户端去接受来自 DevServer 的命令和负责刷新网页的工作。默认是开启的。

historyApiFallback属性：用于方便的开发使用了 HTML5 History API 的单页应用，若是有多个单页应用，需要规则匹配

```javascript
historyApiFallback: {
  // 使用正则匹配命中路由
  rewrites: [
    // /user 开头的都返回 user.html
    { from: /^\/user/, to: '/user.html' },
    { from: /^\/game/, to: '/game.html' },
    // 其它的都返回 index.html
    { from: /./, to: '/index.html' },
  ]
} 
```

contentBase属性：配置 DevServer HTTP 服务器的文件根目录

headers属性：可以在 HTTP 响应中注入一些 HTTP 响应头

host属性：用于配置 DevServer 服务监听的地址

> 例如你想要局域网中的其它设备访问你本地的服务，可以在启动 DevServer 时带上 --host 0.0.0.0

port属性：用于配置 DevServer 服务监听的端口

allowedHosts属性：一个白名单列表，只有 HTTP 请求的 HOST 在列表里才正常返回

disableHostCheck属性：用于配置是否关闭（用于 DNS 重绑定的 HTTP 请求的） HOST 检查。 它通常用于搭配 --host 0.0.0.0 使用

https属性：DevServer 默认使用 HTTP 协议服务，它也能通过 HTTPS 协议服务

clientLogLevel属性：配置在客户端的日志等级（none | error | warning | info - 默认值）

compress属性：配置是否启用 gzip 压缩

open属性：用于在 DevServer 启动且第一次构建完时自动用你系统上默认的浏览器去打开要开发的网页

openPage属性：用于打开指定 URL 的网页

#### Other

Target：可以让 Webpack 构建出针对不同运行环境的代码

| target值 | 描述 |
| --- | --- |
| web | 针对浏览器 (默认)，所有代码都集中在一个文件里 |
| node | 针对 Node.js，使用 require 语句加载 Chunk 代码 |
| async-node | 针对 Node.js，异步加载 Chunk 代码 |
| webworker | 针对 WebWorker |
| electron-main | 针对 Electron 主线程 |
| electron-renderer | 针对 Electron 渲染线程 |

Devtool: 配置 Webpack 如何生成 Source Map

Watch 和 WatchOptions：它支持监听文件更新，在文件发生变化时重新编译

Externals：用来告诉 Webpack 要构建的代码中使用了哪些不用被打包的模块，也就是说这些模版是外部环境提供的，Webpack 在打包时可以忽略它们

ResolveLoader：用来告诉 Webpack 如何去寻找 Loader


### 实践

coming soon...