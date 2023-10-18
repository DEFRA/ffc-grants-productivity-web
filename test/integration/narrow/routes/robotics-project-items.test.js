const { crumbToken } = require('./test-helper')

describe('Robotics project items page', () => {
  const varList = {
    projectSubject: 'Robotics and automatic technology',
    applicant: 'Farmer',
    legalStatus: 'Sole trader',
    planningPermission: 'Secured',
    projectStart: 'Yes, preparatory work',
    tenancy: 'Yes'
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
    expect(response.payload).toContain('Robotic equipment item')
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
  it('when we select /technology-items/ should store user response and redirects to technology-items', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectItems: ['Wavelength-specific LED lighting for horticultural crops', 'Robotic equipment item'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('technology-items')
  })

  it('should store user response and redirects to project cost page', async () => {
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
    varList.projectResponsibility = 'Fake data'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-responsibility\" class=\"govuk-back-link\">Back</a>')
  })
})
