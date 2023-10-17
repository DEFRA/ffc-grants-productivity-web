const { crumbToken } = require('./test-helper')

describe('Robotics project items page', () => {
  const varList = {
    tenancy: null,
    projectSubject: 'Robotics and automatic technology',
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return null
    }
  }))
  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select which items your project needs')
    expect(postResponse.payload).toContain('Advanced ventilation control units')
    expect(postResponse.payload).toContain('Wavelength-specific LED lighting for horticultural crops')
    expect(postResponse.payload).toContain('Robotic equipment item')
  })
  it('when we select /robotic-equipment-items/ should store user response and redirects to robotic-equipment-items', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      payload: { projectItems: 'Robotic equipment item', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('robotic-equipment-items')
  })

  it('should store user response and redirects to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      payload: { projectItems: ['Advanced ventilation control units', 'Wavelength-specific LED lighting for horticultural crops'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })

  it('page loads with correct back link when tenancy is "No" ', async () => {
    varList.tenancy = 'No'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-responsibility\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with correct back link when tenancy is "Yes" ', async () => {
    varList.tenancy = 'Yes'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"tenancy\" class=\"govuk-back-link\">Back</a>')
  })

  
})
