const urlPrefix = require('../config/server').urlPrefix

module.exports = {
  method: 'GET',
  path: `${urlPrefix}/accessibility`,
  options: {
    auth: false
  },
  handler: (request, h) => {
    return h.view('accessibility', { accessibility: 'accessibility' })
  }
}
