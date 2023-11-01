const { crumbToken } = require('./test-helper')
const varListTemplate = { tenancy: 'randomData' }
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
describe('Page: /tenancy-length', () => {
  beforeEach(() => {
    mockVarList = {
      ...varListTemplate
    }
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/tenancy-length`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Do you have a tenancy agreement until 2027 or after?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy-length`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the land has a tenancy agreement in place until 2026 or after')
  })

  it('user selects conditional option: \'No\' -> display conditional page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy-length`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancyLength: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('tenancy-length-condition')
  })

  it('user at tenancy-length-condition page: \'continue\' -> display project page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy-length-condition`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-items')
  })

  it('user selects eligible option: \'Yes\' -> store user response and redirect to /system-type', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy-length`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancyLength: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-items')
  })
})
