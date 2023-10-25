const { crumbToken } = require('./test-helper')

<<<<<<<< HEAD:test/integration/narrow/routes/remaining-costs-solar.test.js
describe('Page: /remaining-costs-solar', () => {
  const varList = { 
    projectCost: '150000', 
    calculatedGrant: '37500', 
    remainingCost: 112500
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs-solar`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Can you pay the remaining costs of £112,500?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: '', crumb: crumbToken }
========
describe('robotics-remaining-costs page', () => {
  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      payload: { canPayRemainingCost: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
>>>>>>>> 65d33ea6c56d4ec46a059313209262538d2aeb12:test/integration/narrow/routes/remaining-costs.test.js
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you can pay the remaining costs')
  })

  it('user selects: <Yes> -> store user response and redirect to project impact page', async () => {
    const postOptions = {
      method: 'POST',
<<<<<<<< HEAD:test/integration/narrow/routes/remaining-costs-solar.test.js
      url: `${global.__URLPREFIX__}/remaining-costs-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'No', crumb: crumbToken }
========
      url: `${global.__URLPREFIX__}/remaining-costs`,
      payload: { canPayRemainingCost: 'Yes', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-impact')
  })

  it('user selects: <No> -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      payload: { canPayRemainingCost: 'No', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
>>>>>>>> 65d33ea6c56d4ec46a059313209262538d2aeb12:test/integration/narrow/routes/remaining-costs.test.js
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })
<<<<<<<< HEAD:test/integration/narrow/routes/remaining-costs-solar.test.js

  it('user selects eligible option: \'Yes\' -> store user response and redirect to /solar-usage', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { remainingCosts: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('agricultural-sector-solar')
  })

  it('page loads with correct back link - potential-amount', async () => {
    varList.projectCost = 499999

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/remaining-costs-solar`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"potential-amount-solar\" class=\"govuk-back-link\">Back</a>')
  })
========
>>>>>>>> 65d33ea6c56d4ec46a059313209262538d2aeb12:test/integration/narrow/routes/remaining-costs.test.js
})
