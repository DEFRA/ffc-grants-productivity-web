const senders = require('../../../../app/messaging/senders')
require('dotenv').config()
const varListTemplate = {
  consentMain: true
}
let mockVarList
jest.mock('grants-helpers', () => ({
  functions: {
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (mockVarList[key]) return mockVarList[key]
      else return null
    }
  }
}))
describe('Reference number page', () => {
  beforeEach(() => {
    mockVarList = { ...varListTemplate }
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('load page successfully with the Reference ID', async () => {
    const getOtions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`
    }
    jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))
    const getResponse = await global.__SERVER__.inject(getOtions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Details submitted')
  })
  it('load page successfully with the solar Reference ID', async () => {
    mockVarList.projectSubject = 'Solar technologies'
    const getOtions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`
    }
    jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))
    const getResponse = await global.__SERVER__.inject(getOtions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Details submitted')
  })
  it('it redirects to start page if no conscent is given', async () => {
    mockVarList.consentMain = null
    const getOtions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`
    }
    const getResponse = await global.__SERVER__.inject(getOtions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(process.env.START_PAGE_URL)
  })
})
