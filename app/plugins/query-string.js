const { cookieOptions, urlPrefix, surveyLink } = require('../config/server')
const { ALL_URLS } = require('../config/question-bank')
const cacheConfig = require('../config/cache')

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, options) => {
      server.ext('onRequest', (request, h) => {
        console.log(request.path)
        return h.continue
       })
    }
  }
}


        // const Hapi = require('@hapi/hapi');
        // const server = Hapi.server({ port: 80 });
        
        // const onRequest = function (request, h) {
        
        //     // Change all requests to '/test'
        //     request.setUrl('/test');
        //     return h.continue;
        // };
        
        // server.ext('onRequest', onRequest);