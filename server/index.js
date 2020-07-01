const Koa = require('koa')
const Router = require('@koa/router')
const staticServer = require('koa-static')
const mount = require('koa-mount')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const handleRender = require('./handle-render')

const app = new Koa()
const router = new Router()
const isDev = process.env.NODE_ENV === 'development'
function createRenderer(bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    // 自定义一些配置
    runInNewContext: false,
    inject: false
  }))
}

async function start() {
  let renderer
  if(isDev) {
    const setupDevServer = require('../build/set-dev-server')
    setupDevServer(
      app,
      (bundle, options) => {
        renderer = createRenderer(bundle, options)
      }
    )
  } else {
    const serverBundle = require('../dist/vue-ssr-server-bundle.json')
    const clientManifest = require('../dist/vue-ssr-client-manifest.json')
    renderer = createRenderer(serverBundle, {
      clientManifest
    })
  }
  router.get('(.*)', async ctx => {
    await handleRender(ctx, renderer)
  })
  app.use(async (ctx, next) => {
    try {
      // console.log(`request with path ${ctx.path}`)
      await next()
    } catch (err) {
      console.log(err)
      ctx.status = 500
      if (isDev) {
        ctx.body = err.message
      } else {
        ctx.body = 'please try again later'
      }
    }
  })
  app.use(mount('/public', staticServer(path.join(__dirname, '../dist'))))
  app.use(router.routes()).use(router.allowedMethods())

  const HOST = process.env.HOST || '0.0.0.0'
  const PORT = process.env.PORT || 7980

  app.listen(PORT, HOST, () => {
    console.log(`server is listening on ${HOST}:${PORT}`)
  })
}

start()
