const { ALL_URLS } = require('../config/question-bank')
const cacheConfig = require('../config/cache')
const { getYarValue, setYarValue } = require('../helpers/session')


module.exports = {
  plugin: {
    name: 'queryString',
    register: (server, options) => {
      server.ext('onRequest', (request, h) => {
        if (request.path === '/productivity/remove-item') {
          console.log(request.raw.req.url, 'I AM INSIDE THE PLUGIN',)
          request.setUrl('/productivity/remove-item')
          // const queryParams = new URLSearchParams(request.raw.req.url.split('?')[1])
          // console.log(queryParams.get('item'),'IIIIIIIIIIII')
          // request.yar.set('confirmItem', queryParams.get('item'))
          // console.log(getYarValue(request, 'confirmItem'),'PPPPPPPPPPPPPPPPPPP')
    // setYarValue(request, 'index', queryParams.get('index'))
  }
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