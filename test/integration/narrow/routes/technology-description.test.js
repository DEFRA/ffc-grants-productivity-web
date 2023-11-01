const { crumbToken } = require('./test-helper')
const fakeDescription = 'fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description '
const varListTemplate = {
  projectItems: ['Other robotic equipment'],
  roboticAutomatic: 'Automatic',
}
const CHARS_OVER_18 = 'FAKEDATAFAKEDATAFAKEDATAFAKEDATAFAKEDATAFAKEDATAFAKEDATA'
let varList
const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return 'Error'
  }
}

jest.mock('../../../../app/helpers/session', () => mockSession)

describe('other Robotics Equipment', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('page loads successfully, with all the fields', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-description`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is your other robotic technology?')
  })

  it('should returns error message if no value entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-description`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a brief description of your technology')
  })


  it('should returns error message if description is more than 250', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-description`,
      payload: { description: fakeDescription, crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Description must be 250 characters or less')
  })

  it('should returns error message if description is less than 10 chars.', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-description`,
      payload: { description: 'fake data', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Description must be 10 characters or more')
  })

  it('should store user response and redirects to robotics conditional page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-description`,
      payload: { otherRoboticTechnology: 'this is fake description', description:'this is fake description', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('other-item')
  })

  it('page loads with correct back link', async () => {
    varListTemplate.roboticAutomatic = 'Automatic'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-description`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"automatic-eligibility\" class=\"govuk-back-link\">Back</a>')
  })
  // it('page loads with correct back link', async () => {
  //   varListTemplate.roboticAutomatic = 'Robotic'
  //   const options = {
  //     method: 'GET',
  //     url: `${global.__URLPREFIX__}/technology-description`
  //   }
  //   const response = await global.__SERVER__.inject(options)
  //   expect(response.statusCode).toBe(200)
  //   expect(response.payload).toContain('<a href=\"robotic-eligibility\" class=\"govuk-back-link\">Back</a>')
  // })
})
