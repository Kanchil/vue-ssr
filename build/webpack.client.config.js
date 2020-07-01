const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const utils = require('./utils')
const baseConfig = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const webpack = require('webpack')
const isDev = process.env.NODE_ENV === 'development'
let plugins = [
  // 此插件在输出目录中
  // 生成 `vue-ssr-client-manifest.json`。
  new VueSSRClientPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  })
]
if(!isDev) {
  plugins = plugins.concat([
    new MiniCssExtractPlugin({
      filename: utils.assetsPath(`css/[name]-[chunkhash:8].css`)
    }),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.NamedChunksPlugin()
  ])
}
module.exports = merge(baseConfig, {
  entry: {
    app: './src/client-entry.js'
  },
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
  optimization: {
    splitChunks: {
      name: "manifest",
      minChunks: Infinity
    },
    runtimeChunk: true
  },
  plugins
})
