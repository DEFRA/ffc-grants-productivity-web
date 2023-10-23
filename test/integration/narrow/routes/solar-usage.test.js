const { crumbToken } = require('./test-helper')

describe('Page: /solar-usage', () => {
  const varList = {
    solarUsage: 'randomData'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return null
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-usage`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will you use most of the energy produced by solar on your farm?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-usage`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarUsage: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if you will use most of the energy produced on your farm')
    expect(postResponse.payload).toContain('Yes')
    expect(postResponse.payload).toContain('No')
  })

  it('user selects \'Yes\' -> store user response and redirect to /solar-size', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-usage`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarUsage: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-size')
  })

  it('user selects \'No\' -> store user response and redirect to /solar-size', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-usage`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarUsage: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-size')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-usage`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"remaining-costs\" class=\"govuk-back-link\">Back</a>')
  })
})
