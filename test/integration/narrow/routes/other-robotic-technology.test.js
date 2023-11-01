const { crumbToken } = require('./test-helper')
const fakeDescription = 'fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description '
const varListTemplate = {
  projectItems: ['Other robotic equipment']
}
const CHARS_OVER_18 = 'FAKEDATAFAKEDATAFAKEDATAFAKEDATAFAKEDATAFAKEDATAFAKEDATA'
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

describe('other Robotics Equipment', () => {
  beforeEach(() => {
    mockVarList = { ...varListTemplate }
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('page loads successfully, with all the fields', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/other-robotic-technology`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is your other robotic technology?')
    expect(response.payload).toContain('Brand')
    expect(response.payload).toContain('Model')
    expect(response.payload).toContain('Enter a brief description of the item and the benefit to your business')
  })

  it('should returns error message if no value entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/other-robotic-technology`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the description of your other robotic technology')
  })

  it('should returns error message if brand and model are over 18 chars.', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/other-robotic-technology`,
      payload: { brand: CHARS_OVER_18, model: CHARS_OVER_18, crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Brand must be 18 characters or less')
    expect(postResponse.payload).toContain('Model must be 18 characters or less')
  })

  it('should returns error message if description is more than 250', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/other-robotic-technology`,
      payload: { description: fakeDescription, crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You can enter up to 250 characters')
  })

  it('should returns error message if description is less than 10 chars.', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/other-robotic-technology`,
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
      url: `${global.__URLPREFIX__}/other-robotic-technology`,
      payload: { otherRoboticTechnology: 'this is fake description', description: 'this is fake description', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('other-conditional')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/other-robotic-technology`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="robotic-automatic" class="govuk-back-link">Back</a>')
  })
})
