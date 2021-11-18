const varListTemplate = {
  consentMain: true
}

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
    const getResponse = await global.__SERVER__.inject(getOtions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('Details submitted')
  })

  it('it redirects to start page if no conscent is given', async () => {
    varList.consentMain = null
    const getOtions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/confirmation`
    }
    const getResponse = await global.__SERVER__.inject(getOtions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe('/productivity/start')
  })
})
