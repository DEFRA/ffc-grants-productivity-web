const { crumbToken } = require('./test-helper')
const varListTemplate = {
  projectSubject: 'Robotics and automatic technology',
  applicant: 'Farmer',
  legalStatus: 'Sole trader',
  planningPermission: 'Secured',
  projectStart: 'Yes, preparatory work',
  tenancy: 'Yes',
  projectItems: 'Robotic equipment item'
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
describe('technology-items', () => {
  beforeEach(() => {
    mockVarList = {
      ...varListTemplate
    }
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const htmlPage = createPage(response.payload)
    const heading = getPageHeading(htmlPage)
    const questionAnswers = getPageRadios(htmlPage)
    expect(extractCleanText(heading)).toBe('What technology does your project need?')
    expect(questionAnswers.length).toBe(9)
    expect(questionAnswers[0].value).toBe('Harvesting technology')
    expect(questionAnswers[1].value).toBe('Weeding technology')
    expect(questionAnswers[2].value).toBe('Spraying technology')
    expect(questionAnswers[3].value).toBe('Driverless tractor')
    expect(questionAnswers[4].value).toBe('Voluntary robotic milking system')
    expect(questionAnswers[5].value).toBe('Feeding system')
    expect(questionAnswers[6].value).toBe('Transplanting technology')
    expect(questionAnswers[7].value).toBe('Slurry and manure management')
    expect(questionAnswers[8].value).toBe('Other robotics or automatic technology')
  })
  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-items`,
      payload: { technologyItems: '', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const questionErrors = getPageErrors(htmlPage)
    const targetError = getTargetByText(questionErrors, 'Select what technology your project needs')
    expect(targetError.length).toBe(1)
  })
  it('store user response and redirect to robotic-automatic page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-items`,
      payload: { technologyItems: 'Harvesting technology', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('robotic-automatic')
  })
  it('page loads with correct back link - project-items', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const htmlPage = createPage(response.payload)
    const backLink = getBackLink(htmlPage)
    expect(backLink.href).toBe('project-items')
  })
})
