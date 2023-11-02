const { crumbToken } = require('./test-helper')
const varListTemplate = {
  projectItems: ['Robotic equipment item', 'Advanced ventilation control units'],
  technologyItems: ['Autonomous driverless tractors or platforms', 'Other robotic equipment']
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

describe('robotics-project-impact', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-impact`,
      payload: { projectImpact: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the project will improve the productivity and profitability of your business')
  })

  it('user selects: <Yes> -> store user response and based on project items selected redirect to data analytics page', async () => {
    varList.technologyItems = ['Feeding system']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-impact`,
      payload: { projectImpact: 'Yes', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('energy-source')
  })

  it('user selects: <No> -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-impact`,
      payload: { projectImpact: 'No', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })
})
