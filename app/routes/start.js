module.exports = {
  method: 'GET',
  path: '/productivity/start',
  handler: (request, h) => {
    return h.view('home', { button: { nextLink: './farming-type', text: 'Start' } })
  }
}
