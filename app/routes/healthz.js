module.exports = {
  method: 'GET',
  path: '/healthz',
  auth: false,
  handler: (request, h) => {
    return h.response('ok').code(200)
  }
}
