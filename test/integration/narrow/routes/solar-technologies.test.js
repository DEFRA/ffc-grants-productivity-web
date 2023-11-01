const { crumbToken } = require('./test-helper')
const varListTemplate = {
  solarTechnologies: 'randomData',
  existingSolar: 'Yes',
  projectSubject: 'Solar technologies',
  tenancy: 'Yes'
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

describe('Page: /solar-technologies', () => {
  beforeEach(() => {
    mockVarList = { ...varListTemplate }
  })
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-technologies`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What solar technologies does your project need?')
    expect(response.payload).toContain('An electrical grid connection')
    expect(response.payload).toContain('Solar panels')
    expect(response.payload).toContain('An inverter')
    expect(response.payload).toContain('A utility meter')
    expect(response.payload).toContain('A battery')
    expect(response.payload).toContain('Limit-loading power diverter to heat or cold store')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarTechnologies: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what solar technologies your project needs')
  })

  it('user selects \'Solar panels\' option -> store user response and redirect to /solar-installation', async () => {
    mockVarList.solarTechnologies = 'Solar panels'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarTechnologies: 'Solar panels', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('solar-installation')
  })

  it('user selects any option AND \'Solar panels\' -> store user response and redirect to /solar-installation', async () => {
    mockVarList.solarTechnologies = ['Solar panels', 'An electrical grid connection']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarTechnologies: ['Solar panels', 'An electrical grid connection'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('solar-installation')
  })

  it('user selects one option WITHOUT \'Solar panels\' -> store user response and redirect to /project-cost-solar', async () => {
    mockVarList.existingSolar = 'Yes'
    mockVarList.solarTechnologies = 'A utility meter'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarTechnologies: 'A utility meter', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('/productivity/project-cost-solar')
  })

  it('user selects multiple options WITHOUT \'Solar panels\' -> store user response and redirect to /project-cost-solar', async () => {
    mockVarList.solarTechnologies = ['An inverter', 'A battery']
    mockVarList.existingSolar = 'No'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarTechnologies: ['An inverter', 'A battery'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-technologies`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="existing-solar" class="govuk-back-link">Back</a>')
  })
})
