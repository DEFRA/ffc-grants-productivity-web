const { crumbToken } = require('./test-helper')
const varListTemplate = {
  projectCost: 37500,
  calculatedGrant: 15000,
  calculatedGrantSolarPreCap: 34567
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
describe('Page: /potential-amount', () => {
  const eligiblePageText = 'You may be able to apply for a grant of up to £15,000, based on the estimated cost of £37,500.'
  beforeEach(() => {
    mockVarList = {
      ...varListTemplate
    }
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  jest.mock('grants-helpers', () => ({
    functions: {
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (mockVarList[key]) return mockVarList[key]
        else return null
      }
    }
  }))

  it('page loads successfully, with all the Eligible options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Potential grant funding')
    expect(response.payload).toContain(eligiblePageText)
  })
  it('should redirect to /remaining-costs-solar when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/potential-amount`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('remaining-costs')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="project-cost" class="govuk-back-link" id="linkBack">Back</a>')
  })

  //  Solar Journey url checks //
  it('page loads with correct back link when the user on solar journey', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount-solar`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="project-cost-solar" class="govuk-back-link" id="linkBack">Back</a>')
  })

  it('should redirect to /remaining-costs-solar when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/potential-amount-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('remaining-costs-solar')
  })
})
