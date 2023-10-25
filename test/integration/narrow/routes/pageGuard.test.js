const createServer = require('../../../../app/server')

require('dotenv').config()

const varListTemplate = {
  projectSubject: 'Robotics and automatic technology',
  applicant: 'Farmer'
}
let varList
const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return undefined
  }
}
jest.mock('../../../../app/helpers/session', () => mockSession)

describe('Page Guard', () => {
  const OLD_ENV = process.env
  let server

  beforeEach(async () => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    varList = { ...varListTemplate }

  })

  afterEach(() => {
    process.env = OLD_ENV
    server.stop()
    jest.clearAllMocks()

  })

  // massive edit time yayyyyyyyy

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

  // it('should redirect to start page if the user skip journey question', async () => {
  //   server = await createServer()
  //   const getOptions = {
  //     method: 'GET',
  //     url: `${global.__URLPREFIX__}/technology-use`
  //   }

  //   const response = await server.inject(getOptions)
  //   expect(response.statusCode).toBe(302)
  //   expect(response.headers.location).toBe(process.env.START_PAGE_URL)
  // })

  it('AND - should redirect to start page if no key found', async () => {

    varList.projectSubject = 'random'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(process.env.START_PAGE_URL)
  })

  it('AND - should load normal page if all keys found (1 item)', async () => {

    varList.projectSubject = 'Robotics and automatic technology'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Who are you?')
  })

  it('OR - should redirect to start page if no key found', async () => {

    varList.projectSubject = 'random'
    varList.applicant = 'random'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(process.env.START_PAGE_URL)
  })

  it('OR - should load normal page if any key found', async () => {

    varList.businessLocation = 'Yes'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('What is the legal status of the business?')
  })

  it('OR andCheck - should redirect to start page if projectSubject not correct', async () => {

    varList.projectSubject = 'Robotics and automatic technology'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-solar`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(process.env.START_PAGE_URL)
  })

  it('OR andCheck - should load normal page if any key found as well as projectSubject', async () => {

    varList.projectSubject = 'Solar technologies'
    varList.tenancy = 'Yes'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-solar`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Does your farm have an existing solar PV system?')
  })

  it('NOT - should redirect to start page if any key found', async () => {

    varList.legalStatus = 'None of the above'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/country`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(process.env.START_PAGE_URL)
  })

  it('NOT - should load normal page if key not found', async () => {

    varList.legalStatus = 'asjhakh'

    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/country`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Is the planned project in England?')
  })


})
