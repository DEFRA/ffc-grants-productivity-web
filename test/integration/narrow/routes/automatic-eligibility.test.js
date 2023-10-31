const { crumbToken } = require('./test-helper')
describe('Page: /automatic-eligibility', () => {
  const varList = {
    automaticEligibility: ['Has sensing system that can understand its environment', 'Makes decisions and plans', 'Can control its actuators (the devices that move robotic joints)', 'Works in a continuous loop', 'None of the above'],
    technologyItems: 'Harvesting technology',
    roboticAutomatic: 'Automatic'
  }
  jest.mock('grants-helpers', () => ({
    functions: {
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (varList[key]) return varList[key]
        else return null
      }
    }
  }))
  it('page loads successfully with all the options', async () => {
    expect.assertions(8)
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/automatic-eligibility`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const h1s = page.querySelectorAll('h1.govuk-heading-l')
    const mainH1 = getTargetByText(h1s, 'Which eligibility criteria does your automatic harvesting technology meet?')
    const checkboxes = getPageCheckboxes(page)
    expect(mainH1).not.toBeNull()
    expect(checkboxes.length).toBe(5)
    expect(checkboxes[0].value).toBe('Has sensing system that can understand its environment')
    expect(checkboxes[1].value).toBe('Makes decisions and plans')
    expect(checkboxes[2].value).toBe('Can control its actuators (the devices that move robotic joints)')
    expect(checkboxes[3].value).toBe('Works in a continuous loop')
    expect(checkboxes[4].value).toBe('None of the above')
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
    const page = createPage(postResponse.payload)
    const errors = getPageErrors(page)
    const error = getTargetByText(errors, 'Select what eligibility criteria your automatic technology meets')
    expect(error.length).toBe(1)
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
    const page = createPage(postResponse.payload)
    const headings = page.querySelectorAll('h1.govuk-heading-l')
    const h1 = getTargetByText(headings, 'You cannot apply for a grant from this scheme')
    expect(h1).not.toBeNull()
    const paragraphs = findParagraphs(page)
    const paragraph = getTargetByText(paragraphs, 'Automatic items must meet at least 2 criteria to be eligible for grant funding.')
    expect(paragraph).not.toBeNull()
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
    const page = createPage(postResponse.payload)
    const headings = page.querySelectorAll('h1.govuk-heading-l')
    const h1 = getTargetByText(headings, 'You cannot apply for a grant from this scheme')
    expect(h1).not.toBeNull()
    const paragraphs = findParagraphs(page)
    const paragraph = getTargetByText(paragraphs, 'Automatic items must meet at least 2 criteria to be eligible for grant funding.')
    expect(paragraph).not.toBeNull()
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
    const page = createPage(response.payload)
    const h1 = getPageHeading(page)
    expect(h1).not.toBeNull()
    expect(extractCleanText(h1)).toBe('Which eligibility criteria does your other automatic technology meet?')
  })
  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/automatic-eligibility`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const backLink = getBackLink(page)
    expect(backLink).not.toBeNull()
    expect(backLink.href).toBe('robotic-automatic')
  })
})
