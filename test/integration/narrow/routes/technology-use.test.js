const { crumbToken } = require('./test-helper')

describe('robotics Technology page', () => {

  test('loads page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-use`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Are you already using this technology?')
    expect(response.payload).toContain('Yes, we’re using it now')
    expect(response.payload).toContain('Yes, we’re using it now but want to upgrade')
    expect(response.payload).toContain('Yes, as a pilot, demonstration or trial')
    expect(response.payload).toContain('No, we haven’t used it yet')

  })
  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-use`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if you are already using this technology')
  })

  it('store user response and redirect to energy source page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-use`,
      payload: { technologyUse: 'some fake technology', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/labour-saved')
  })
  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-use`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"agricultural-sector\" class=\"govuk-back-link\">Back</a>')
  })
})
