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

describe('Robotics project items page', () => {
  beforeEach(() => {
    mockVarList = { ...varListTemplate }
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-items`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Which items does your project need?')
    expect(response.payload).toContain('Advanced ventilation control units')
    expect(response.payload).toContain('Wavelength-specific LED lighting for horticultural crops')
    expect(response.payload).toContain('Robotic and automatic technology')
  })
  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      payload: { projectItems: '', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select which items your project needs')
  })
  it('when we select /technology-items/ should store user response and redirects to technology-items', async () => {
    mockVarList.projectItems = ['Wavelength-specific LED lighting for horticultural crops', 'Robotic and automatic technology']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectItems: ['Wavelength-specific LED lighting for horticultural crops', 'Robotic and automatic technology'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('technology-items')
  })

  it('should store user response and redirects to project cost page', async () => {
    mockVarList.projectItems = ['Advanced ventilation control units', 'Wavelength-specific LED lighting for horticultural crops']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectItems: ['Advanced ventilation control units', 'Wavelength-specific LED lighting for horticultural crops'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })
  it('page loads with correct back link when tenancy is "Yes" ', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="tenancy" class="govuk-back-link">Back</a>')
  })
  it('page loads with correct back link when tenancy is "No" ', async () => {
    mockVarList.tenancy = 'No'
    mockVarList.projectResponsibility = 'Yes, I plan to take full responsibility for my project'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="project-responsibility" class="govuk-back-link">Back</a>')
  })
})
