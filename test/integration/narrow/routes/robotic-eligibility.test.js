const { crumbToken } = require('./test-helper')

describe('Page: /robotic-eligibility', () => {
  const varList = {
    roboticEligibility: 'Yes',
    technologyItems: 'Harvesting technology',
    roboticAutomatic: 'Robotic'
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
      url: `${global.__URLPREFIX__}/robotic-eligibility`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Does your robotic harvesting technology fit the eligibility criteria?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticEligibility: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if your robotic technology fits the eligibility criteria')
  })

  it('should display ineligible page when user response is \'No\'', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticEligibility: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
    expect(postResponse.payload).toContain('RPA will only fund robotic technology that:')
  })
  it('user selects \'Other robotics or automatic technology\' -> title should be \'Which eligibility criteria does your other automatic technology meet?\'', async () => {
    varList.technologyItems = 'Other robotics or automatic technology'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/robotic-eligibility`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Does your robotic technology fit the eligibility criteria?')
  })
  it('user selects eligible option, store user response and redirect to /technology-description', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticEligibility: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('technology-description')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/robotic-eligibility`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"robotic-automatic\" class=\"govuk-back-link\">Back</a>')
  })
})
