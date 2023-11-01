const { crumbToken } = require('./test-helper')
const varListTemplate = {
  projectSubject: 'Robotics and automatic technology'
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
describe('Page: /robotic-automatic', () => {
  beforeEach(() => {
    mockVarList = { ...varListTemplate }
  })
  afterAll(() => {
    jest.resetAllMocks()
  })

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/robotic-automatic`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Is the harvesting technology robotic or automatic?')
    expect(response.payload).toContain('Robotic')
    expect(response.payload).toContain('Automatic')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-automatic`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticAutomatic: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if your harvesting technology is robotic or automatic')
  })
  it('user selects \'Robotic\' and Other robotic or automatic technology from tech items -> store user response and redirect to /other-robotic-technology', async () => {
    mockVarList.technologyItems = 'Other robotics or automatic technology'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-automatic`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticAutomatic: 'Robotic', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('other-robotic-technology')
  })
  it('user selects \'Robotic\' and except Other robotic or automatic technology from tech items -> store user response and redirect to /other-item', async () => {
    mockVarList.technologyItems = 'Spraying technology'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-automatic`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticAutomatic: 'Robotic', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('other-item')
  })
  it('user selects \'Automatic\' -> store user response and redirect to /automatic-eligibility', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-automatic`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticAutomatic: 'Automatic', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('automatic-eligibility')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/robotic-automatic`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const htmlPage = createPage(response.payload)
    const backLink = getBackLink(htmlPage)
    expect(backLink.href).toBe('technology-items')
    expect(extractCleanText(backLink)).toBe('Back')
  })
})
