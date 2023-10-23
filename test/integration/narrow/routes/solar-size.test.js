const { crumbToken } = require('./test-helper')

describe('Page: /solar-size', () => {
  const varList = {
    solarSize: 'randomData'
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
      url: `${global.__URLPREFIX__}/solar/solar-size`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How much energy will your solar PV system output?')
    expect(response.payload).toContain('Up to 100kW')
    expect(response.payload).toContain('100kW to 350kW')
    expect(response.payload).toContain('More than 350kW')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar/solar-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarSize: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how much energy your solar PV system will output')
  })

  it('user selects \'Up to 100kW\' -> store user response and redirect to /agricultural-sector', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar/solar-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarSize: 'Up to 100kW', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('agricultural-sector')
  })

  it('user selects \'100kW to 350kW\' -> store user response and redirect to /agricultural-sector', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar/solar-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarSize: '100kW to 350kW', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('agricultural-sector')
  })

  it('user selects \'More than 350kW\' -> store user response and redirect to /agricultural-sector', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar/solar-size`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarSize: 'More than 350kW', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('agricultural-sector')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar/solar-size`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"solar-usage\" class=\"govuk-back-link\">Back</a>')
  })
})
