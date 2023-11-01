const { crumbToken } = require('./test-helper')

describe('robotics data analytics page', () => {

it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/data-analytics`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will your project use data analytics to improve productivity?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
})

it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/data-analytics`,
      payload: { canPayRemainingCost: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select whether your project will use data analytics to improve farm productivity')
})

it('store user response and redirect to energy source page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/data-analytics`,
      payload: { dataAnalytics: 'some fake answer', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('energy-source')
  })
it('page loads with correct back link - project-impact', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/data-analytics`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-impact\" class=\"govuk-back-link\">Back</a>')
  })
})
