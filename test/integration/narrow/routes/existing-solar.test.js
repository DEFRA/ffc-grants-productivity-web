const { crumbToken } = require('./test-helper')

describe('Page: /existing-solar', () => {
  const varList = {
    existingSolar: 'randomData'
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
      url: `${global.__URLPREFIX__}/solar/existing-solar`
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
      url: `${global.__URLPREFIX__}/solar/existing-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingSolar: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the planned project is on land the farm business owns')
  })

  it('user selects \'Yes\' -> store user response and redirect to /solar-technologies', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar/existing-solar`,
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
      url: `${global.__URLPREFIX__}/solar/existing-solar`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { existingSolar: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar-technologies')
  })
  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar/existing-solar`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"project-start\" class=\"govuk-back-link\">Back</a>')
  })
})
