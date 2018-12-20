## 一、webpack 配置示例
参见：<https://webpack.docschina.org/configuration/>

```js
const path = require('path');
const webpack = require('webpack');
const sassLoader = 'style-loader!css-loader?modules&importLoaders&localIdentName=[name]__[local]__[hash:base64:5]!sass-loader?sourceMap=true&sourceMapContents=true';
const sassLoaderDemo = 'style-loader!css-loader!sass-loader?sourceMap=true&sourceMapContents=true';
module.exports = {
  mode:'development',
 /* https://webpack.docschina.org/concepts/mode/#src/components/Sidebar/Sidebar.jsx
  - development：会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。
  - production：会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin.
  - none：不选用任何默认优化选项
 */


  devtool: 'cheap-module-eval-source-map',
  /*https://webpack.docschina.org/configuration/devtool/#src/components/Sidebar/Sidebar.jsx
  *此选项控制是否生成，以及如何生成 source map。
  通过为浏览器devtools添加元信息来增强调试功能) 
   - 不同值的sourcemap构建速度、品质不同，在生产环境一般使用cheap-source-map
  */
  entry: [
    //'webpack-hot-middleware/client',
    './demo/src/app.js'
  ],
  /*
  * 入口文件路径
  * 对于多入口的写法
  entry: {
   manage_adfornews: ['./client/js/manage/adfornews.js','./client/scss/app.scss'],
   manage_adforradio:['./client/js/manage/adforradio.js','./client/scss/app.scss']
  }
  */

  output: {
    // webpack 如何输出结果的相关选项

    path: path.resolve(__dirname, '.tmp'),//所有输出文件的目标路径,必须是绝对路径
    filename: 'bundle.js',
    /* 输出文件的名称
     - filename: '[name].js'用于多个入口chunk
     - filename:"[chunkhash].js", // 使用基于每个 chunk 内容的 hash
     - filename: '[name].[hash].bundle.js'//使用每次构建过程中，唯一的 hash 生成
    */
    publicPath: '/static/',
    /*此选项指定在浏览器中所引用的「此输出目录对应的公开 URL」
    - "https://cdn.example.com/static/", //CDN路径
    - '',//相对于HTML页面
    - '/static/',//相对于服务的路径
    */
  },

  module: {
    //这些选项决定了如何处理项目中的不同类型的模块

    rules: //type array. 创建模块时，匹配请求的规则数组。这些规则能够对模块(module)应用 loader，或者修改解析器(parser)。


     [{
      test:/\.jsx?$/,//匹配.js和.jsx结尾的文件
      /*
      Rule.test 是 Rule.resource.test 的简写。
      */
      include: [//包含的资源路径
        path.join(__dirname, 'demo','src'),
        path.join(__dirname, 'src', 'js')
      ],
      loaders: ['babel-loader']
      /*Rule.loaders is an alias to Rule.use.
      loader 用于对模块的源代码进行转换
      */
    }, {
      test: /\.scss$/,
      include: [
        path.join(__dirname, 'src', 'scss'),
        //path.resolve(__dirname, 'node_modules')
      ],
      loader: sassLoader
    },{
      test: /\.scss$/,
      include: [
        path.join(__dirname, 'demo'),
        //path.resolve(__dirname, 'node_modules')
      ],
      loader: sassLoaderDemo
    }]
  },

  resolve: { 
    //这些选项能设置模块如何被解析
    
    alias: {
      //Create aliases to import or require certain modules more easily. Eg: in app.js, "import React from '../node_modules/react';" can now be written as "import React from 'react"
      //创建 import 或 require 的别名，来确保模块引入变得更简单。
      'react': path.join(__dirname,'node_modules','react')
    },
    extensions: [
      //Enables users to leave off the extension when importing.(省略引入文件的后缀)
      '.js', '.jsx','.scss','.css'
    ]
  },

  plugins: [//一些插件
    //new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
```

## 二、相关问题
#### (1) 什么是webpack和grunt和gulp有什么不同?
webpack是一个模块化打包器。
本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(static module bundler)。在 webpack 处理应用程序时，它会在内部创建一个依赖图(dependency graph)，用于映射到项目需要的每个模块，然后将所有这些依赖生成到一个或多个bundle。

它的一个突出特点是code-spliting,代码分裂

#### (2)什么是bundle,chunck,module?
bundle:打包好的一个结果文件

chunk：entry下可以有多个chunck，每个chunk可以包含多个要打包的文件，最终每个chunk会生成一个bundle。output的filename如果设置为'[name].js'，则可以以每个chunk名称作为每个bundle的名字。(当然如果plugin里面有一些相关插件可以分裂除其中的一些代码，比如说把css分裂出去叫[name].css)

module:指开发中的不同模块，在配置文件中module.rules是一个数组，决定了如何处理项目中的不同类型的模块。

#### (3)什么是loader？什么是plubin?
loaders告诉webpack如何转换不同类型的模块。**逆序执行**

plugin是用来自定义webpack打包过程的方式，这些插件的方法参与到整个webpack打包的各个流程(生命周期)，**在loaders后执行**，针对的是loaders转化好的所有文件。按照**顺序执行**。

**同时命中一个规则的话逆序执行loader。**

**loader和plugin 是先loader后plugin。**

#### (4)如何可以自动生成webpack配置？
webpack-cli等工具

#### (5)webpack-dev-server和http服务器如nginx有什么区别?
webpack-dev-server使用内存来存储webpack开发环境下的打包文件，并且可以使用模块热更新，他比传统的http服务对开发更加简单高效。

使用 koa 的时候通常用到 koa-webpack, webpack-dev-middleware 和 webpack-hot-middleware 来实现 webpack-dev-server 的功能。

#### (6)什么 是模块热更新？
模块热更新是webpack的一个功能，他可以使得代码修改过后不用刷新浏览器就可以更新，是高级版的自动刷新浏览器。

#### (7)什么是长缓存？在webpack中如何做到长缓存优化？
浏览器在用户访问页面的时候，为了加快加载速度，会对用户访问的静态资源进行存储，但是每一次代码升级或是更新，都需要浏览器去下载新的代码。

避免方式最方便和简单的更新方式就是引入新的文件名称。在webpack中可以在output中输出的文件指定chunkhash即设置filename:[name].[hash].js,即设置并且分离经常更新的代码和框架代码。

**webpack的name.[hash].js的作用：**
如果内容改变，则hash改变，否则hash不变。这样如果资源变化，则没有缓存。

#### (8)webpack怎么实现treeshaking
Tree-shaking是指在打包中去除那些引入了，但是在代码中没有被用到的那些死代码。在webpack中Tree-shaking是通过 uglifyjS 来Tree-shaking JS。Css需要使用Purify-CSS。

具体实现：
webpack 负责对代码进行标记，把 import & export 标记为 3 类：

- 所有 import 标记为 /* harmony import */
- 被使用过的 export 标记为 /* harmony export ([type]) */，其中 [type] 和 webpack 内部有关，可能是 binding, immutable 等等。
- 没被使用过的 import 标记为 /* unused harmony export [FuncName] */，其中 [FuncName] 为 export 的方法名称

之后在 Uglifyjs (或者其他类似的工具) 步骤进行代码精简，把没用的都删除。