const { crumbToken } = require('./test-helper')
const fakeDescription = 'fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description fake description '
const varListTemplate = {
  projectItems: ['Other robotic equipment']
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

describe('other Robotics Equipment', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/other-robotic-equipment`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if your other robotic equipment meets the eligibility criteria')
  })

  it('should returns error message if description is not entered for selected yes option ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/other-robotic-equipment`,
      payload: { otherRoboticEquipment: 'Yes', roboticEquipment: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Describe your other robotic equipment')
  })

  it('should returns error message if description is more than 60 words', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/other-robotic-equipment`,
      payload: { otherRoboticEquipment: 'Yes', roboticEquipment: fakeDescription, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You have a maximum of 60 words')
  })

  it('should store user response and redirects to robotics conditional page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/other-robotic-equipment`,
      payload: { otherRoboticEquipment: 'Yes', roboticEquipment: 'this is fake description', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('other-robotic-conditional')
  })

  it('should display ineligible page when user response is \'No\' and user has selected only \'Other robotic equipment\' option', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/other-robotic-equipment`,
      payload: { otherRoboticEquipment: 'No', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('should display equipment ineligible conditional page when user response is \'No\' and user has also selected other eligible option', async () => {
    varList.projectItems = ['Advanced ventilation control units', 'Robotic weeding equipment','Other robotic equipment']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/other-robotic-equipment`,
      payload: { otherRoboticEquipment: 'No', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('Your other robotic equipment is not eligible for a grant from this scheme')
  })
})