const Router = require('@koa/router')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('../../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../../dist/vue-ssr-client-manifest.json')
const template = fs.readFileSync(path.join(__dirname, '../server.template.ejs'), 'utf-8')
const router = new Router()
const render = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  inject: false,
  clientManifest
})
router.get('(.*)', async ctx => {
  ctx.headers['Context-type'] = 'text/html'
  const context = { url: ctx.path }
  const appString = await render.renderToString(context)
  const {
    title = ''
  } = context.meta.inject()
  const html = ejs.render(template, {
    title: title.text(),
    appString,
    hints: context.renderResourceHints(),
    scripts: context.renderScripts(),
    styles: context.renderStyles(),
    initState: context.renderState()
  })
  ctx.body = html
})
module.exports = router
