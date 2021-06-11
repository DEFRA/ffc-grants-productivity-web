module.exports = {
  method: 'GET',
  path: '/productivity/start',
  handler: (request, h) => {
    return h.response('Start page').code(200)
  }
}
