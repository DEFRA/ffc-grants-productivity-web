const { crumbToken } = require('./test-helper')
const varListTemplate = {
  projectSubject: 'Robotics and automatic technology',
  applicant: 'Farmer',
  businessLocation: 'Yes'
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
describe('Legal status page', () => {
  beforeEach(() => {
    mockVarList = { ...varListTemplate }
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('loads page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const heading = getPageHeading(page)
    expect(extractCleanText(heading)).toEqual(
      'What is the legal status of the business?'
    )
    const radios = getPageRadios(page)
    expect(radios.length).toEqual(12)
    expect(radios[0].value).toBe('Sole trader')
    expect(radios[1].value).toBe('Partnership')
    expect(radios[2].value).toBe('Limited company')
    expect(radios[3].value).toBe('Charity')
    expect(radios[4].value).toBe('Trust')
    expect(radios[5].value).toBe('Limited liability partnership')
    expect(radios[6].value).toBe('Community interest company')
    expect(radios[7].value).toBe('Limited partnership')
    expect(radios[8].value).toBe('Industrial and provident society')
    expect(radios[9].value).toBe('Co-operative society (Co-Op)')
    expect(radios[10].value).toBe('Community benefit society (BenCom)')
    expect(radios[11].value).toBe('None of the above')
  })
  test('submits form successfully and redirects to next page', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/legal-status`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken, legalStatus: 'Limited company' }
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('country')
  })
  test('shows error message if no option selected', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/legal-status`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        crumb: crumbToken,
        legalStatus: ''
      }
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const errors = getPageErrors(page)
    expect(errors.length).toBe(1)
    expect(extractCleanText(errors[0])).toBe(
      'Select the legal status of the business'
    )
  })
  it('page loads with back link to /project-subject if user selected Solar', async () => {
    mockVarList.applicant = null
    mockVarList.projectSubject = 'Solar technologies'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const backLink = getBackLink(page)
    expect(extractCleanText(backLink)).toBe('Back')
    expect(backLink.href).toBe('project-subject')
  })
  it('page loads with correct back link - if applicant was a farmer', async () => {
    mockVarList.applicant = 'Farmer'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const backLink = getBackLink(page)
    expect(extractCleanText(backLink)).toBe('Back')
    expect(backLink.href).toBe('applicant')
  })
  it('page loads with correct back link - if applicant was a contractor', async () => {
    mockVarList.applicant = 'Contractor'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const backLink = getBackLink(page)
    expect(extractCleanText(backLink)).toBe('Back')
    expect(backLink.href).toBe('business-location')
  })
})
