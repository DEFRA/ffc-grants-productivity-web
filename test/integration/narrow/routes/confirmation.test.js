const varListTemplate = {
  consentMain: true
}

const senders = require('../../../../app/messaging/senders')

require('dotenv').config()

let varList
const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return 'Error'
  }
}

jest.mock('../../../../app/helpers/session', () => mockSession)

describe('Reference number page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
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
    varList.projectSubject ='Solar project items'
    const getOtions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`
    }
    
    jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))

    const getResponse = await global.__SERVER__.inject(getOtions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Details submitted')
    expect(getResponse.payload).toContain('You can check if you can apply for a grant for <a class="govuk-link" href="/productivity/project-subject" rel="noopener noreferrer">farm productivity project items</a>. The minimum grant is £25,000 (50% of £50,000). The maximum grant amount for both projects together is £500,000.')
  })

  it('load page successfully with the Farm productivity project items Reference ID', async () => {
    varList.projectSubject = 'Farm productivity project items'
    const getOtions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`
    }
    
    jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))

    const getResponse = await global.__SERVER__.inject(getOtions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Details submitted')
    expect(getResponse.payload).toContain('You can check if you can apply for a grant for <a class="govuk-link" href="/productivity/project-subject" rel="noopener noreferrer">solar project items</a>. The minimum grant is £15,000 (25% of £60,000). The maximum grant amount for both projects together is £500,000.')
    expect(getResponse.payload).toContain('If you want your landlord to underwrite your project, you should agree this with them before you begin your full application. Your landlord will need to complete a form at full application. This will confirm that they agree to take over your project, including conditions in your Grant Funding Agreement, if your tenancy ends.')
    expect(getResponse.payload).toContain('What do you think of this service?')
  })

  it('it redirects to start page if no conscent is given', async () => {
    varList.consentMain = null
    const getOtions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`
    }
    const getResponse = await global.__SERVER__.inject(getOtions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(process.env.START_PAGE_URL)
  })
})
