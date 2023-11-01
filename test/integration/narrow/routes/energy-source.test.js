const { crumbToken } = require('./test-helper')
const varListTemplate = {
  energySource: ['Biofuels', 'another source']
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
describe('Robotics Energy Source Page', () => {
  beforeEach(() => {
    mockVarList = {
      ...varListTemplate
    }
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/energy-source`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select up to 2 types of energy your project will use')
  })
  it('should returns error message if more than 2 options selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/energy-source`,
      payload: { energySource: ['some source', 'another source', 'energy source 3'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select up to 2 types of energy your project will use')
  })
  it('should store user response and redirects to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/energy-source`,
      payload: { energySource: ['some source', 'another source'], crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('agricultural-sector')
  })
  it('should store user response and redirects to project cost page', async () => {
    mockVarList.energySource = ['Fossil fuels', 'Mains electricity']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/energy-source`,
      payload: { energySource: ['Fossil fuels', 'Mains electricity'], crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('fossil-fuel-conditional')
  })
})
