const merge = require('webpack-merge')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const utils = require('./utils')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const isDev = process.env.NODE_ENV === 'development'
let plugins = [
  // 这是将服务器的整个输出
  // 构建为单个 JSON 文件的插件。
  // 默认文件名为 `vue-ssr-server-bundle.json`
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
    'process.env.VUE_ENV': '"server"'
  })
]
if(isDev) {
  plugins = plugins.concat([
    new VueSSRServerPlugin()
  ])
}
if(!isDev) {
  plugins = plugins.concat([
    new MiniCssExtractPlugin({
      filename: utils.assetsPath(`css/[name]-[chunkhash:8].css`)
    })
  ])
}
module.exports = merge(baseConfig, {
  entry: './src/server-entry.js',
  target: 'node',
  output: {
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    whitelist: /\.(css|vue|scss)$/
  }),
  plugins
})
