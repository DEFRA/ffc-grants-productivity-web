beforeEach(async () => {
  // ...
  // Set reference to server in order to close the server during teardown.
  const createServer = require('../app/server')
  const server = await createServer()
  await server.start()
  global.__SERVER__ = server
})
