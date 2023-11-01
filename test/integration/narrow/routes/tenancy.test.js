const { crumbToken } = require('./test-helper')
const varListTemplate = {
  tenancy: 'randomData',
  projectSubject: 'randomData'
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
describe('Page: /tenancy', () => {
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
      url: `${global.__URLPREFIX__}/tenancy`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Is the planned project on land the business owns?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancy: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the planned project is on land the business owns')
  })

  it('user selects \'Yes\' -> store user response and redirect to /project-items', async () => {
    mockVarList.tenancy = 'Yes'
    mockVarList.projectSubject = 'Robotics and automatic technology'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancy: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-items')
  })

  it('user selects \'Yes\' -> store user response and redirect to /existing-solar', async () => {
    mockVarList.tenancy = 'Yes'
    mockVarList.projectSubject = 'Solar technologies'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancy: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('existing-solar')
  })

  it('user selects \'No\' -> store user response and redirect to /project-responsibility', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { tenancy: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-responsibility')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/tenancy`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const backLink = getBackLink(page)
    expect(backLink.href).toEqual('/project-items')
    expect(extractCleanText(backLink)).toEqual('Back')
  })
})
