const path = require('path')
const uglify = require('uglifyjs-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const miniCssExtractPlugin = require('mini-css-extract-plugin')

const config = {
  mode: process.env.NODE_ENV,
  entry: {
    index: path.resolve(__dirname, './src/js/index.js'),
    detail: path.resolve(__dirname, './src/js/detail.js'),
    collections: path.resolve(__dirname, './src/js/collections.js')
  },
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: 'js/[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
        query: {
          presets: ['latest']
        }
      },
      {
        test: /\.tpl$/,
        loader: 'ejs-loader'
      },
      {
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
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [autoprefixer('last 5 versions')]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/i,
        loader: [
          'url-loader?limit=1024&name=img/[name]-[hash].[ext]',
          'image-webpack-loader'
        ]
      }
    ]
  },
  plugins: [
    new uglify(),
    new htmlWebpackPlugin({
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      title: 'js-新闻',
      chunksSortMode: 'manual',
      chunks: ['index'],
      excludeChunks: ['node-modules'],
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
      excludeChunks: ['node-modules'],
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
      excludeChunks: ['node-modules'],
      hash: true
    }),
    new miniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  devServer: {
    watchOptions: {
      ignored: /node_modules/
    },
    host: 'localhost',
    port: 3200
  }
}

module.exports = config
