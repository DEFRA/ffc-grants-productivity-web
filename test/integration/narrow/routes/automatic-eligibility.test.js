const { crumbToken } = require('./test-helper')

describe('Page: /automatic-eligibility', () => {
  const varList = {
    automaticEligibility: ['Has sensing system that can understand its environment', 'Makes decisions and plans', 'Can control its actuators (the devices that move robotic joints)', 'Works in a continuous loop', 'None of the above'],
    technologyItems: 'Harvesting technology',
    roboticAutomatic: 'Automatic'
  }

  jest.mock('../../../../app/helpers/functions/session', () => ({
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
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('Automatic items must meet at least 2 criteria to be eligible for grant funding.')
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
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('Automatic items must meet at least 2 criteria to be eligible for grant funding.')
  })

  it('user selects two eligible options and \'Automatic\' and \'Other robotic or automatic technology\' from tech items -> store user response and redirect to /other-automatic-technology', async () => {
    varList.technologyItems = 'Other robotics or automatic technology'
    varList.automaticEligibility = ['Has sensing system that can understand its environment', 'Makes decisions and plans']
    varList.roboticAutomatic = 'Automatic'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/automatic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { automaticEligibility: ['Has sensing system that can understand its environment', 'Makes decisions and plans'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('/productivity/other-automatic-technology')
  })

  it('user selects two eligible options and \'Harvesting technology\' -> store user response and redirect to /other-item', async () => {
    varList.automaticEligibilityItem = ['Can control its actuators (the devices that move robotic joints)', 'Works in a continuous loop']
    varList.technologyItems = 'Harvesting technology'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/automatic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { automaticEligibility: ['Can control its actuators (the devices that move robotic joints)', 'Works in a continuous loop'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/productivity/other-item')
  })

  it('user selects \'Other robotics or automatic technology\' -> title should be \'Which eligibility criteria does your other automatic technology meet?\'', async () => {
    varList.technologyItems = 'Other robotics or automatic technology'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/automatic-eligibility`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Which eligibility criteria does your other automatic technology meet?')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/automatic-eligibility`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="robotic-automatic"  class="govuk-back-link" id="linkBack">Back</a>')
  })
})
