const { crumbToken } = require('./test-helper')

describe('Page: /solar-technologies', () => {
  let varList = {
    solarTechnologies: 'randomData',
    existingSolar: 'Yes',
    projectSubject: 'Solar project items',
    tenancy: 'Yes'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return null
    }
  }))

  it('page loads successfully, with all the options - score', async () => {
    varList['current-score'] = true
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-technologies`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What solar project items does your project need?')
    expect(response.payload).toContain('An electrical grid connection')
    expect(response.payload).toContain('Solar PV panels')
    expect(response.payload).toContain('An inverter')
    expect(response.payload).toContain('A utility meter')
    expect(response.payload).toContain('A battery')
    expect(response.payload).toContain('Power diverter')
    expect(response.payload).toContain('Redirects excess solar energy to power storage (for example heat stores)')
  })

  it('page loads successfully, with all the options - no score', async () => {
    varList['current-score'] = false

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/solar-technologies`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What solar project items does your project need?')
    expect(response.payload).toContain('An electrical grid connection')
    expect(response.payload).toContain('Solar PV panels')
    expect(response.payload).toContain('An inverter')
    expect(response.payload).toContain('A utility meter')
    expect(response.payload).toContain('A battery')
    expect(response.payload).toContain('Power diverter')
    expect(response.payload).toContain('Redirects excess solar energy to power storage (for example heat stores)')
  })

  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarTechnologies: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select what solar project items your project needs')
  })

  it('user selects \'Solar PV panels\' option -> store user response and redirect to /solar-installation', async () => {
    varList.solarTechnologies = 'Solar PV panels'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarTechnologies: 'Solar PV panels', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('solar-installation')
  })

  it('user selects any option AND \'Solar PV panels\' -> store user response and redirect to /solar-installation', async () => {
    varList.solarTechnologies = ['Solar PV panels', 'An electrical grid connection']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarTechnologies: ['Solar PV panels', 'An electrical grid connection'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('solar-installation')
  })

  it('user selects one option WITHOUT \'Solar PV panels\' -> store user response and redirect to /project-cost-solar', async () => {
    varList.existingSolar = 'Yes'
    varList.solarTechnologies = 'A utility meter'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarTechnologies: 'A utility meter', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('/productivity/project-cost-solar')
  })

  it('user selects multiple options WITHOUT \'Solar PV panels\' -> store user response and redirect to /project-cost-solar', async () => {
    varList.solarTechnologies = ['An inverter', 'A battery']
    varList.existingSolar = 'No'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { solarTechnologies: ['An inverter', 'A battery'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })


  it('store user response and redirect to score page if score', async () => {
    varList['current-score'] = true
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/solar-technologies`,
      payload: { solarTechnologies: ['An inverter', 'A battery'], secBtn: 'Back to score', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/productivity/score')
  })
  // it('page loads with correct back link', async () => {
  //   const options = {
  //     method: 'GET',
  //     url: `${global.__URLPREFIX__}/solar-technologies`
  //   }

  //   const response = await global.__SERVER__.inject(options)
  //   expect(response.statusCode).toBe(200)
  //   expect(response.payload).toContain('<a href=\"existing-solar\" class=\"govuk-back-link\">Back</a>')
  // })
})
