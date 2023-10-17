const { crumbToken } = require('./test-helper')

describe('Robotics project items page', () => {
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

  it('should store user response and redirects to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      payload: { projectItems: ['some items', 'another item'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })

  it('when we select /robotic-equipment-items/ should store user response and redirects to robotic-equipment-items', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-items`,
      payload: { projectItems: ['Robotic equipment item', 'another item'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('robotic-equipment-items')
  })

  it('page loads with correct back link', async () => {
    varList.tenancy = 'No'
    varList.projectSubject = 'Robotics and automatic technology'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-responsibility\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with correct back link', async () => {
    varList.tenancy = 'Yes'
    varList.projectSubject = 'Robotics and automatic technology'

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"tenancy\" class=\"govuk-back-link\">Back</a>')
  })

  
})
