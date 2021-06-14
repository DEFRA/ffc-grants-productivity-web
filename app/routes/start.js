module.exports = {
  method: 'GET',
  path: '/productivity/start',
  handler: (request, h) => {
    return h.response('Start page, this is just a placeholder').code(200)
  }
}
