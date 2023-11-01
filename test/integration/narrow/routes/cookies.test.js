const { crumbToken } = require('./test-helper')
const varListTemplate = { farmerDetails: 'someValue', contractorsDetails: 'someValue' }
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
describe('Cookies page', () => {
  beforeEach(() => {
    mockVarList = { ...varListTemplate }
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/cookies`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('analytics')
  })
  it('store user response ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/cookies`,
      payload: { analytics: true, async: true, crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toBe('ok')
  })
  it('store user response if no async', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/cookies`,
      payload: { analytics: true, crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/productivity/cookies?updated=true')
  })
})
