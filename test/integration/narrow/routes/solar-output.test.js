const { crumbToken } = require('./test-helper')

describe('Page: /solar-output', () => {
  const varList = {
    solarOutput: 'randomData',
    solarInstallation: 'randomData'
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
      url: `${global.__URLPREFIX__}/solar-output`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How much energy will your solar PV system output?')
    expect(response.payload).toContain('Up to 50kW')
    expect(response.payload).toContain('51kW to 100kW')
    expect(response.payload).toContain('101kW to 150kW')
    expect(response.payload).toContain('151kW to 200kW')
    expect(response.payload).toContain('More than 201kW')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-output`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarOutput: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select how much energy your solar PV system will output')
  })

  it('user selects \'Up to 100kW\' -> store user response and redirect to /project-cost-solar', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-output`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarOutput: 'Up to 50kW', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost-solar')
  })

  it('user selects \'100kW to 350kW\' -> store user response and redirect to /project-cost-solar', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-output`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarOutput: '100kW to 350kW', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost-solar')
  })

  it('user selects \'More than 350kW\' -> store user response and redirect to /project-cost-solar', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-output`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarOutput: 'More than 350kW', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost-solar')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-output`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"solar-installation\" class=\"govuk-back-link\">Back</a>')
  })
})
