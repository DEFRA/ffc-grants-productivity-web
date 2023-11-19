const { crumbToken } = require('./test-helper')

describe('technology-items', () => {
  const varList = {
    projectSubject: 'Farm productivity project items',
    applicant: 'Farmer',
    legalStatus: 'Sole trader',
    planningPermission: 'Secured',
    projectStart: 'Yes, preparatory work',
    tenancy: 'Yes',
    projectItems: 'Robotic equipment item'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      console.log(key, 'key')
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  it('page loads successfully, with all the options for Farmer', async () => {
    varList.applicant = 'Farmer'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What robotic or automatic technology does your project need?')
    expect(response.payload).toContain('Harvesting technology')
    expect(response.payload).toContain('Transplanting technology')
    expect(response.payload).toContain('Weeding technology')
    expect(response.payload).toContain('Driverless robotic tractor or platform')
    expect(response.payload).toContain('Robotic spraying technology')
    expect(response.payload).toContain('Voluntary robotic milking system')
    expect(response.payload).toContain('Feeding robots')
    expect(response.payload).toContain('Slurry robots')
    expect(response.payload).toContain('Other robotics or automatic technology')
  })

  it('page loads successfully, with all the options for Contractor', async () => {
    varList.applicant = 'Contractor'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What robotic or automatic technology does your project need?')
    expect(response.payload).toContain('Harvesting technology')
    expect(response.payload).toContain('Weeding technology')
    expect(response.payload).toContain('Driverless robotic tractor or platform')
    expect(response.payload).toContain('Robotic spraying technology')
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
    varList.technologyItems = 'Weeding technology'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-items`,
      payload: { technologyItems: 'Weeding technology', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('robotic-automatic')
  })

  it('store user response and redirect to robotic-eligibility page', async () => {
    varList.technologyItems = ['Driverless robotic tractor or platform', 'Voluntary robotic milking system', 'Slurry robots', 'Robotic spraying technology', 'Feeding robots']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-items`,
      payload: { technologyItems: 'Feeding robots', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('robotic-eligibility')
  })

  it('page loads with correct back link /project-items if applicant is Farmer', async () => {
    varList.applicant = 'Farmer'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/productivity/project-items\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link /project-responsibility if applicant is Contractor and tenancy answer is No', async () => {
    varList.applicant = 'Contractor'
    varList.tenancy = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/productivity/project-responsibility\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link /tenancy if applicant is Contractor and tenancy answer is Yes', async () => {
    varList.applicant = 'Contractor'
    varList.tenancy = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/productivity/tenancy\" class=\"govuk-back-link\">Back</a>')
  })
})
