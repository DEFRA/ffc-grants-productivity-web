module.exports = [
  {
    method: 'GET',
    path: '/productivity/start',
    handler: (request, h) => {
      return h.view('home', { button: { nextLink: 'project-subject', text: 'Start now' } })
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.redirect('/productivity/start')
    }
  }
]
