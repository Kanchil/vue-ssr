const Koa = require('koa')
const staticServer = require('koa-static')
const mount = require('koa-mount')
const path = require('path')
const app = new Koa()
const pageRouter = require('./router/pageRouter')
const isDev = process.env.NODE_ENV === 'development'
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
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())


const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 7980

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`)
})
