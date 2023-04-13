const createServer = require('../../../../app/server')

require('dotenv').config()

describe('Page Guard', () => {
  const OLD_ENV = process.env
  let server

  beforeEach(async () => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = OLD_ENV
    server.stop()
  })

  it('shoud redirect to start page if the site is decommissioned', async () => {
    process.env.SERVICE_END_DATE = '2021/02/17'
    process.env.SERVICE_END_TIME = '23:59:58'
    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-subject`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(process.env.START_PAGE_URL)
  })

  it('should redirect to start page if the user skip journey question', async () => {
    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/robotics/technology`
    }

    const response = await server.inject(getOptions)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(process.env.START_PAGE_URL)
  })
})
