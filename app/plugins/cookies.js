const config = require('../config/server').cookieOptions
const { getCurrentPolicy, validSession, sessionIgnorePaths } = require('../cookies')
const cacheConfig = require('../config/cache')

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, options) => {
      server.state('cookies_policy', config)

      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500 && request.response.source.manager._context) {
          const cookiesPolicy = getCurrentPolicy(request, h)
          request.response.source.manager._context.cookiesPolicy = cookiesPolicy
          request.response.source.manager._context.sessionTimeoutInMin = ((cacheConfig.expiresIn * 60) / (3600 * 1000)) - 10
        }

        if (!sessionIgnorePaths.find(path => request.path.startsWith(path)) && request.path !== '/') {
          if (!validSession(request)) {
            return h.redirect('session-timeout')
          }
        }
        return h.continue
      })
    }
  }
}