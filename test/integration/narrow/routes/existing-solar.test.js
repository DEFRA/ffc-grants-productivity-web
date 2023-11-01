const { crumbToken } = require('./test-helper')
const varListTemplate = {
  existingSolar: 'randomData',
  projectSubject: 'Solar technologies',
  projectResponsibility: 'Yes, I plan to take full responsibility for my project'
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
describe('Page: /existing-solar', () => {
  beforeEach(() => {
    mockVarList = { ...varListTemplate }
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-solar`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const heading = getPageHeading(page)
    expect(extractCleanText(heading)).toBe('Does your farm have an existing solar PV system?')
    const radios = getPageRadios(page)
    expect(radios.length).toBe(2)
    expect(radios[0].value).toBe('Yes')
    expect(radios[1].value).toBe('No')
  })
  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingSolar: '', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errors = getPageErrors(page)
    expect(errors.length).toBe(1)
    expect(extractCleanText(errors[0])).toBe('Select yes if your farm has an existing solar PV system')
  })
  it('user selects \'Yes\' -> store user response and redirect to /solar-technologies', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingSolar: 'Yes', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-technologies')
  })
  it('user selects \'No\' -> store user response and redirect to solar-technologies', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingSolar: 'No', crumb: crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-technologies')
  })
  it('page loads with correct back link', async () => {
    mockVarList.tenancy = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-solar`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const backLink = getBackLink(page)
    expect(extractCleanText(backLink)).toBe('Back')
    expect(backLink.href).toBe('/productivity/tenancy')
  })
  it('page loads with correct back link', async () => {
    mockVarList.tenancy = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-solar`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const backLink = getBackLink(page)
    expect(extractCleanText(backLink)).toBe('Back')
    expect(backLink.href).toBe('/productivity/project-responsibility')
  })
})
