const { crumbToken } = require('./test-helper')

describe('Page: /existing-solar', () => {
  const varList = {
    existingSolar: 'randomData'
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
      url: `${global.__URLPREFIX__}/existing-solar`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Does your farm have an existing solar PV system?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingSolar: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if your farm has an existing solar PV system')
    expect(postResponse.payload).toContain('Yes')
    expect(postResponse.payload).toContain('No')
  })

  it('user selects \'Yes\' -> store user response and redirect to /solar-technologies', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingSolar: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-technologies')
  })

  it('user selects \'No\' -> store user response and redirect to solar-technologies', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/existing-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingSolar: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-technologies')
  })

  it('page loads with correct back link', async () => {
    varList.tenancy = 'Yes'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-solar`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/productivity/tenancy\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with correct back link', async () => {
    varList.tenancy = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/existing-solar`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/productivity/project-responsibility\" class=\"govuk-back-link\">Back</a>')
  })
})
