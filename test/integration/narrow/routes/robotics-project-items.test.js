const { crumbToken } = require('./test-helper')

describe('Robotics project items page', () => {
  const varList = {
    projectSubject: 'Farm productivity project items',
    applicant: 'Farmer',
    legalStatus: 'Sole trader',
    planningPermission: 'Secured',
    projectStart: 'Yes, preparatory work',
    tenancy: 'Yes',
    projectItems: 'Robotic equipment item',
    projectItemsList: []
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))
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
      payload: { projectItems: '',  crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select which items your project needs')
  })
  it('when we select /technology-items/ should store user response and redirects to technology-items - no loops', async () => {
    varList.projectItems = ['Wavelength-specific LED lighting for horticultural crops', 'Robotic and automatic technology']
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

  it('when we select /technology-items/ should store user response and redirects to project-items-summary - already looped', async () => {
    varList.projectItemsList = ['Robotic and automatic technology']
    varList.projectItems = ['Wavelength-specific LED lighting for horticultural crops', 'Robotic and automatic technology']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectItems: ['Wavelength-specific LED lighting for horticultural crops', 'Robotic and automatic technology'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/productivity/project-items-summary')
  })

  it('should store user response and redirects to project cost page', async () => {
    varList.projectItemsList = []
    varList.projectItems = ['Advanced ventilation control units', 'Wavelength-specific LED lighting for horticultural crops']
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
    expect(response.payload).toContain('<a href=\"tenancy\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with correct back link when tenancy is "No" ', async () => {
    varList.tenancy = 'No'
    varList.projectResponsibility = 'Yes, I plan to take full responsibility for my project'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-responsibility\" class=\"govuk-back-link\">Back</a>')
  })
})
