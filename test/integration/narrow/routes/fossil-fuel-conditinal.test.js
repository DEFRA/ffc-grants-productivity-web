const { crumbToken } = require('./test-helper')
const mockVarList = { energySource: 'Fossil fuels' }
const eligiblePageText = 'I confirm I understand fossil fuel technology will only be funded where there is no commercially available electric or renewable energy alternative.'
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
describe('Page: /fossil-fuel-conditional', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  afterAll(() => {
    jest.resetModules()
  })
  it('page loads successfully, with all the Eligible options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/fossil-fuel-conditional`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Your fossil fuel technology might be eligible')
    expect(response.payload).toContain(eligiblePageText)
  })
  it('should redirect to /agricultural-sector when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/fossil-fuel-conditional`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { otherRoboticsConditional: 'Yes', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('agricultural-sector')
  })
  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/fossil-fuel-conditional`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="energy-source" class="govuk-back-link" id="linkBack">Back</a>')
  })
})
