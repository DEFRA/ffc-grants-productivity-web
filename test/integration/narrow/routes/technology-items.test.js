const { crumbToken } = require('./test-helper')

describe('technology-items', () => {
  const varList = {
    projectSubject: 'Farm productivity project items',
    applicant: 'Farmer',
    legalStatus: 'Sole trader',
    planningPermission: 'Secured',
    projectStart: 'Yes, preparatory work',
    tenancy: 'Yes',
    projectItems: 'Robotic equipment item',
    automaticEligibility: ['Has sensing system that can understand its environment'],
    roboticEligibility: 'No'
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
  it('page loads successfully, with all the options when automaticEligibility is null', async () => {
    varList.applicant = 'Farmer'
    varList.automaticEligibility = null
    varList.roboticEligibility = null
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
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


  const testNextLink = async (option, destination) => { 
    varList.technologyItems = option
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-items`,
      payload: { technologyItems: option, crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(destination)
  }

  it('store user response and redirect to /robotic-automatic page if \"Harvesting technology\" was chosen', async () => {
    await testNextLink('Harvesting technology', 'robotic-automatic')
  })

  it('store user response and redirect to /robotic-automatic page if \"Transplanting technology\" was chosen', async () => {
    await testNextLink('Transplanting technology', 'robotic-automatic')
  })

  it('store user response and redirect to /robotic-automatic page if \"Weeding technology\" was chosen', async () => {
    await testNextLink('Weeding technology', 'robotic-automatic')
  })

  it('store user response and redirect to /robotic-automatic page if \"Other robotics or automatic technology\" was chosen', async () => {
    await testNextLink('Other robotics or automatic technology', 'robotic-automatic')
  })

  it('store user response and redirect to /robotic-eligibility page if \"Driverless robotic tractor or platform\" was chosen', async () => {
    await testNextLink('Driverless robotic tractor or platform', 'robotic-eligibility')
  })

  it('store user response and redirect to /robotic-eligibility page if \"Robotic spraying technology\" was chosen', async () => {
    await testNextLink('Robotic spraying technology', 'robotic-eligibility')
  })

  it('store user response and redirect to /robotic-eligibility page if \"Voluntary robotic milking system\" was chosen', async () => {
    await testNextLink('Voluntary robotic milking system', 'robotic-eligibility')
  })

  it('store user response and redirect to /robotic-eligibility page if \"Feeding robots\" was chosen', async () => {
    await testNextLink('Feeding robots', 'robotic-eligibility')
  })

  it('store user response and redirect to /robotic-eligibility page if \"Slurry robots\" was chosen', async () => {
    await testNextLink('Slurry robots', 'robotic-eligibility')
  })

  it('page loads with correct back link /project-items if applicant is Farmer', async () => {
    varList.applicant = 'Farmer'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-items`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-items\" class=\"govuk-back-link\">Back</a>')
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
