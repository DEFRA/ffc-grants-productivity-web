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
describe('confirm page', () => {
  beforeEach(() => {
    mockVarList = {
      ...varListTemplate
    }
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should load page successfully with all details', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirm`,
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/check-details'
      }
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Confirm and send')
    expect(response.payload).toContain('I confirm that, to the best of my knowledge, the details I have provided are correct.')
    expect(response.payload).toContain('I understand the project’s eligibility and estimated grant amount is based on the answers I provided.')
    expect(response.payload).toContain('I am aware that the information I submit will be checked by the RPA.')
    expect(response.payload).toContain('I am happy to be contacted by Defra and RPA (or third-party on their behalf) about my application.')
    expect(response.payload).toContain('Improving our schemes')
    expect(response.payload).toContain('So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third-party working for us, to contact you.')
    expect(response.payload).toContain('(Optional) I confirm') // checkbox
    expect(response.payload).toContain('You can only submit your details once')
    expect(response.payload).toContain('Confirm and send') // button
  })
  it('should store user response and redirects to confirmation page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/confirm`,
      payload: { consentOptional: 'some conscent', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('confirmation')
  })
})
