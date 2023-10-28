const { crumbToken } = require('./test-helper')

describe('technology-items', () => {
  const varList = {
    projectSubject: 'Robotics and automatic technology',
    applicant: 'Farmer',
    legalStatus: 'Sole trader',
    planningPermission: 'Secured',
    projectStart: 'Yes, preparatory work',
    tenancy: 'Yes',
    projectItems: 'Robotic equipment item'
  }

  jest.mock('../../../../app/helpers/functions/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      console.log(key, 'key')
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What technology does your project need?')
    expect(response.payload).toContain('Harvesting technology')
    expect(response.payload).toContain('Weeding technology')
    expect(response.payload).toContain('Spraying technology')
    expect(response.payload).toContain('Driverless tractor')
    expect(response.payload).toContain('Voluntary robotic milking system')
    expect(response.payload).toContain('Feeding system')
    expect(response.payload).toContain('Transplanting technology')
    expect(response.payload).toContain('Slurry and manure management')
    expect(response.payload).toContain('Other robotics or automatic technology')
  })
  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-items`,
      payload: { technologyItems: '', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what technology your project needs')
  })

  it('store user response and redirect to robotic-automatic page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-items`,
      payload: { technologyItems: 'Harvesting technology', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('robotic-automatic')
  })

  it('page loads with correct back link - project-items', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-items\" class=\"govuk-back-link\">Back</a>')
  })
})
