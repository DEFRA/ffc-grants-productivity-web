const { setYarValue, getYarValue } = require('../helpers/session')

module.exports = {
  plugin: {
    name: 'queryString',
    register: async (server, options) => {
      server.ext('onRequest', (request, h) => {
        if (request.path === '/productivity/remove-item' && request.url.href.includes('?')) {
          console.log(request.raw.req.url, 'I AM INSIDE THE PLUGIN',)
          const queryParams = new URLSearchParams(request.url.href.split('?')[1])
          
          // this does work to redirect to url, however cant pass the query params to handlers.js from here, nor can they be set

          // code added to handler.js only (no plugin) works in app

          console.log(request.payload)
          request.payload = {
            confirmItem: queryParams.get('item'),
            index: queryParams.get('index')
          }
          console.log(request.payload, 'request.payload')

          h.request = request


          return h.redirect('/productivity/remove-item').takeover()


        }
        return h.continue
      })
    }
  }
}
