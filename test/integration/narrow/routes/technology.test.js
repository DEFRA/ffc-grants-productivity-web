const { crumbToken } = require('./test-helper')
const varListTemplate = {
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
describe('robotics Technology page', () => {
  beforeEach(() => {
    mockVarList = { ...varListTemplate }
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-use`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you have used this technology on your farm')
  })

  it('store user response and redirect to energy source page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-use`,
      payload: { technology: 'some fake technology', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/score')
  })
})
