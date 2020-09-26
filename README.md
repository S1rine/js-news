# 新闻 WEB 应用

一个使用 `zepto.js` 开发的新闻头条 `web` 应用。
这一次也是学习到了如何利用原生 `js` 进行组件化模块化工程化的开发。

- [新闻 WEB 应用](#新闻-web-应用)
  - [移动端响应式配置](#移动端响应式配置)
  - [`webpack` 配置](#webpack-配置)
  - [组件开发过程](#组件开发过程)
  - [`css` 文件引入图片路径问题](#css-文件引入图片路径问题)
  - [前端缓存池](#前端缓存池)

## 移动端响应式配置

简单配置方法：

```js
document.documentElement.style.fontSize =
  document.documentElement.clientWidth / 37.5 + 'px'
```

引入根据设备宽度计算根元素字体大小的代码，式子中的 `37.5` 可以根据设计稿进行修改，一般参照 `iphone6/7/8` 来设置，使用 `375px`， 将根元素设置为 `10px`， 其余元素的宽度大小设置起来会比较方便。

## `webpack` 配置

```js
const path = require('path')
// 引入`nodejs`包用来设置路径
const uglify = require('uglifyjs-webpack-plugin')
// 对代码进行丑化(压缩)的 `plugin`
const htmlWebpackPlugin = require('html-webpack-plugin')
// 配置 `html` 的 `plugin`
const autoprefixer = require('autoprefixer')
// 配置 `css` 兼容前缀的模块
const miniCssExtractPlugin = require('mini-css-extract-plugin')
// 将 `css` 提取为单独文件的插件

const config = {
  mode: process.env.NODE_ENV,
  // 配置环境为开发还是生产
  entry: {
    // 入口配置，多页面可以采用多个入口
    index: path.resolve(__dirname, './src/js/index.js'),
    detail: path.resolve(__dirname, './src/js/detail.js'),
    collections: path.resolve(__dirname, './src/js/collections.js')
  },
  output: {
    // 出口
    path: path.resolve(__dirname + '/dist'),
    // 出口输出路径
    filename: 'js/[name].js',
    // 输出的文件名
    publicPath: '/'
    // 静态资源获取根路径
  },
  module: {
    // 模块
    rules: [
      // loader 规则
      {
        // 匹配 js 文件 使用 babel 转换 es6等代码
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
        query: {
          presets: ['latest']
        }
      },
      // 匹配 tpl 模板文件
      {
        test: /\.tpl$/,
        loader: 'ejs-loader'
      },
      {
        // 匹配 scss 文件
        test: /\.scss$/,
        use: [
          // 配置单独的css文件
          {
            loader: miniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          // 'style-loader', //配置css注入html中
          'css-loader',
          {
            // 兼容配置
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [autoprefixer('last 5 versions')]
              }
            }
          },
          // 首先将sass语法转换
          'sass-loader'
        ]
      },
      {
        // 图片文件匹配
        test: /\.(png|jpg|jpeg|gif|ico)$/i,
        loader: [
          // 配置如果小于1024则转换为base64 输出文件名
          'url-loader?limit=1024&name=img/[name]-[hash].[ext]',
          'image-webpack-loader'
        ]
      }
    ]
  },
  plugins: [
    new uglify(),
    new htmlWebpackPlugin({
      // 配置删除注释和空格
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      // 文件名
      filename: 'index.html',
      // 模板位置
      template: path.resolve(__dirname, 'src/index.html'),
      // 文件名，可以在模板中使用 <%= htmlWebpackPlugin.options.title%> 获取
      title: 'js-新闻',
      // 块排序模式
      chunksSortMode: 'manual',
      // 块
      chunks: ['index'],
      // 除去 node_modules
      excludeChunks: ['node_modules'],
      hash: true
    }),
    new htmlWebpackPlugin({
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      filename: 'detail.html',
      template: path.resolve(__dirname, 'src/detail.html'),
      title: '新闻詳情',
      chunksSortMode: 'manual',
      chunks: ['detail'],
      excludeChunks: ['node_modules'],
      hash: true
    }),
    new htmlWebpackPlugin({
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      filename: 'collections.html',
      template: path.resolve(__dirname, 'src/collections.html'),
      title: '我的收藏',
      chunksSortMode: 'manual',
      chunks: ['collections'],
      excludeChunks: ['node_modules'],
      hash: true
    }),
    new miniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  devServer: {
    // 开发服务器配置
    watchOptions: {
      ignored: /node_modules/
    },
    host: 'localhost',
    port: 3200
  }
}

module.exports = config
```

## 组件开发过程

一个组件的基本配置为一个 `js` 文件， `tpl` 文件， `scss` 文件。
`tpl` 为模板文件，编写组件模板。
`scss` 编写样式。
`js` 文件中导入模板文件，对变量进行正则匹配，替换组件调用时传入的参数来实现组件传值。

使用方法：引入组件的 `js` 文件，调用模板生成函数传入所需的参数，操作 `dom` 渲染页面。

## `css` 文件引入图片路径问题

当 `webpack` 配置选择为提取独立的 `css` 文件时，`css` 文件中引入的图片会出现错误，因为 `css` 文件默认引入路径为自身所在路径，需要在 `webpack.config.js` 文件中配置 `publicPath` 为 `/` 根目录，那么图片就会从根目录引入。

## 前端缓存池

前端缓存池即为在前端浏览器存储数据，让数据不出现重复请求的情况，优化网络情况。

方法为在内存中放置一个变量，来存储数据。根据分类为键设置一个对象，每个对象是一个数组，数组元素为每一页的数据。
