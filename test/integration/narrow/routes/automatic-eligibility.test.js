const { crumbToken } = require('./test-helper')

describe('Page: /automatic-eligibility', () => {
  const varList = {
    automaticEligibility: ['Has sensing system that can understand its environment','Makes decisions and plans','Can control its actuators (the devices that move robotic joints)','Works in a continuous loop','None of the above'],
    technologyItems: 'Harvesting technology',
    roboticAutomatic: 'Automatic'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
    }
  }))

  it('page loads successfully with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/automatic-eligibility`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Which eligibility criteria does your automatic harvesting technology meet?')
    expect(response.payload).toContain('Has sensing system that can understand its environment')
    expect(response.payload).toContain('Makes decisions and plans')
    expect(response.payload).toContain('Can control its actuators (the devices that move robotic joints)')
    expect(response.payload).toContain('Works in a continuous loop')
    expect(response.payload).toContain('None of the above')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/automatic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { automaticEligibility: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what eligibility criteria your automatic technology meets')
  })

  it('should display ineligible page when user response is \'None of the above\'', async () => {
    varList.automaticEligibility = ['None of the above']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/automatic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { automaticEligibility: ['None of the above'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant funding for this technology')
    expect(postResponse.payload).toContain('Automatic technology must fit at least 2 criteria to be eligible for grant funding.')
    expect(postResponse.payload).toContain('Add another technology')
  })

  it('should display error message when user response are \'None of the above\' with other options', async () => {
    varList.automaticEligibility = ['None of the above', 'Makes decisions and plans', 'Has sensing system that can understand its environment']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/automatic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { automaticEligibility: ['None of the above', 'Makes decisions and plans', 'Has sensing system that can understand its environment'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot select that combination of options')
    expect(postResponse.payload).toContain('Which eligibility criteria does your automatic harvesting technology meet?')
  })

  it('should display ineligible page when user selects only one option', async () => {
    varList.automaticEligibility = ['Makes decisions and plans']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/automatic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { automaticEligibility: ['Makes decisions and plans'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant funding for this technology')
    expect(postResponse.payload).toContain('Automatic technology must fit at least 2 criteria to be eligible for grant funding.')
    expect(postResponse.payload).toContain('Add another technology')
  })

  it('should display ineligible page with "Continue with items" button, if user selects one option for the second project item', async () => {
    varList.projectItemsList = ['Harvesting technology', 'Other robotics or automatic technology']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/automatic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { automaticEligibility: ['Makes decisions and plans'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant funding for this technology')
    expect(postResponse.payload).toContain('Automatic technology must fit at least 2 criteria to be eligible for grant funding.')
    expect(postResponse.payload).toContain('Add another technology')
    expect(postResponse.payload).toContain('Continue with eligible technology')
  })
  it('user selects two eligible options and \'Harvesting technology\' -> store user response and redirect to /other-item', async () => {
    varList.automaticEligibility = ['Makes decisions and plans', 'Has sensing system that can understand its environment']
    varList.technologyItems = 'Harvesting technology'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/automatic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { automaticEligibility: ['Makes decisions and plans', 'Has sensing system that can understand its environment'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/productivity/technology-description')
  })

  it('user selects \'Other robotics or automatic technology\' -> title should be \'Which eligibility criteria does your automatic technology meet?\'', async () => {
    varList.technologyItems = 'Other robotics or automatic technology'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/automatic-eligibility`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Which eligibility criteria does your automatic technology meet?')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/automatic-eligibility`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"robotic-automatic\" class=\"govuk-back-link\">Back</a>')
  })
})
