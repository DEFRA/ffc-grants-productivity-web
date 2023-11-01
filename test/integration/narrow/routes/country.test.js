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
describe('country', () => {
  beforeEach(() => {
    mockVarList = { ...varListTemplate }
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      payload: { projectPostcode: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the project is in England')
  })

  it('should store user response and redirects to planning permission page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      payload: { inEngland: 'Yes', projectPostcode: 'XX1 5XX', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('planning-permission')
  })

  it('should display ineligible page when user response is \'No\'', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      payload: { projectPostcode: '', inEngland: 'No', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })
})
