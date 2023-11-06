const { crumbToken } = require('./test-helper')

describe('Page: /robotic-eligibility', () => {
  const varList = {
    roboticEligibility: 'Yes',
    roboticAutomatic: 'Robotic',
    projectItemsList: []
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
    expect(response.payload).toContain('Does your robotic harvesting technology fit the eligibility criteria?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
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

  it('should redirect to /technology-description page when user response is \'Yes\'', async () => {
    varList.roboticEligibility = 'Yes'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticEligibility: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.headers.location).toBe('/productivity/technology-description')
  })

  it('should display ineligible page when user response is \'No\'', async () => {
    varList.roboticEligibility = 'No'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticEligibility: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for grant funding for this item')
    expect(postResponse.payload).toContain('RPA will only fund robotic technology that:')
    expect(postResponse.payload).toContain('Add another item')
  })

  it('should display ineligible page with "Add another item" and "Continue with eligible items" button, if user selects No for the second project item', async () => {
    varList.projectItemsList = ['Harvesting technology', 'Other robotics or automatic technology']
    varList.roboticEligibility = 'No'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-eligibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticEligibility: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant funding for this item')
    expect(postResponse.payload).toContain('RPA will only fund robotic technology that:')
    expect(postResponse.payload).toContain('Add another item')
    expect(postResponse.payload).toContain('Continue with eligible items')
  })
})
