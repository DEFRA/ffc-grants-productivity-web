const { crumbToken } = require('./test-helper')

describe('Page: /project-responsibility', () => {
  const varList = { 'project-responsibility': 'randomData' }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-responsibility`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Will you take full responsibility for your project?')
    expect(response.payload).toContain('Yes, I plan to take full responsibility for my project')
    expect(response.payload).toContain('No, I plan to ask my landlord to underwrite my agreement')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-responsibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectResponsibility: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if will take full responsibility for your project')
  })

  it('user selects \'Yes\' -> store user response and redirect to /existing-solar', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-responsibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectResponsibility: 'Yes, I plan to take full responsibility for my project', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar/existing-solar')
  })

  it('user selects \'No\' -> store user response and redirect to /existing-solar', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-responsibility`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { projectResponsibility: 'No, I plan to ask my landlord to underwrite my agreement', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('solar/existing-solar')
  })
  it('page loads with correct back link', async () => {
    varList.tenancy ='No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-responsibility`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"tenancy\" class=\"govuk-back-link\">Back</a>')
  })
})