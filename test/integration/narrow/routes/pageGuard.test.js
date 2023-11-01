const createServer = require('../../../../app/server')

require('dotenv').config()

const varListTemplate = {
  projectSubject: 'Robotics and automatic technology',
  applicant: 'Farmer'
}
let mockVarList
jest.mock('grants-helpers', () => {
  const originalModule = jest.requireActual('grants-helpers')
  return {
    ...originalModule,
    setYarValue: (request, key, value) => {
      mockVarList[key] = value
    },
    getYarValue: (request, key) => {
      if (mockVarList[key]) return mockVarList[key]
      else return null
    }
  }
})

describe('Page Guard', () => {
  const OLD_ENV = process.env
  let server

  beforeEach(async () => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
    mockVarList = { ...varListTemplate }
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

  it('AND - should redirect to start page if no key found', async () => {
    mockVarList.projectSubject = 'random'

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
    mockVarList.projectSubject = 'Robotics and automatic technology'

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
    mockVarList.projectSubject = 'random'
    mockVarList.applicant = 'random'
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
    mockVarList.businessLocation = 'Yes'

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
    mockVarList.projectSubject = 'Robotics and automatic technology'

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
    mockVarList.projectSubject = 'Solar technologies'
    mockVarList.tenancy = 'Yes'

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
    mockVarList.legalStatus = 'None of the above'

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
    mockVarList.legalStatus = 'asjhakh'

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
