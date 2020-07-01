const path = require('path')
const utils = require('./utils')
const vueLoaderConfig = require('./vue-loader.config')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const isDev = process.env.NODE_ENV === 'development'
module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev
    ? '#cheap-module-source-map'
    : false,
  output: {
    publicPath: '/public/',
    path: path.join(__dirname, '..', '/dist'),
    filename: isDev ? 'js/[name].js' : utils.assetsPath('js/[name]-[chunkhash:8].js')
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.vue', '.scss', '.json']
  },
  module: {
    rules: [
      ...utils.styleLoaders({
        sourceMap: isDev,
        extract: !isDev,
        usePostCSS: true
      }),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: isDev ? 'img/[name].[ext]' : utils.assetsPath(`img/[name].[hash:8].[ext]`),
          esModule: false
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: isDev ? 'media/[name].[ext]' : utils.assetsPath(`media/[name].[hash:8].[ext]`),
          esModule: false
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: isDev ? 'fonts/[name].[ext]' : utils.assetsPath(`fonts/[name].[hash:8].[ext]`),
          esModule: false
        }
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
}
