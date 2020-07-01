const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const template = fs.readFileSync(path.join(__dirname, './server.template.ejs'), 'utf-8')
module.exports = async (ctx, render) => {
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
}
