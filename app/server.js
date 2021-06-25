const Hapi = require('@hapi/hapi')
const nunjucks = require('nunjucks')
const path = require('path')
const { version } = require('../package.json')
const vision = require('@hapi/vision')
const inert = require('@hapi/inert')

async function createServer () {
  const server = Hapi.server({
    port: process.env.PORT
  })
  
  const routes = [].concat(
    require('./routes/healthy'),
    require('./routes/healthz'),
    require('./routes/start'),
    ...require('./routes/index')
  )
  console.log(routes)
  server.route(routes)
  await server.register(inert)
  await server.register(vision)

  server.views({
    engines: {
      njk: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)
          return context => template.render(context)
        }
      }
    },
    relativeTo: __dirname,
    compileOptions: {
      environment: nunjucks.configure([
        path.join(__dirname, 'templates'),
        path.join(__dirname, 'assets', 'dist'),
        'node_modules/govuk-frontend/'
      ])
    },
    path: './templates',
    context: {
      appVersion: version,
      assetpath: '/assets',
      govukAssetpath: '/assets',
      serviceName: 'FFC Grants Service',
      pageTitle: 'FFC Grants Service - GOV.UK'
    }
  })

  return server
}
module.exports = createServer