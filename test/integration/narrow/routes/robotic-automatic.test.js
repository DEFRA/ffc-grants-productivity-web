const { crumbToken } = require('./test-helper')

describe('Page: /robotic-automatic', () => {
  const varList = {
    projectSubject: 'Farm productivity project items',
    technologyItems: 'Harvesting technology',
    roboticAutomatic: 'Robotic'
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
      url: `${global.__URLPREFIX__}/robotic-automatic`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Is the harvesting technology robotic or automatic?')
    expect(response.payload).toContain('Robotic')
    expect(response.payload).toContain('Automatic')
  })
  it('no option selected -> show error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-automatic`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select if your technology is robotic or automatic')
    expect(postResponse.payload).toContain('Is the harvesting technology robotic or automatic?')
  })
  it('page loads successfully, with all the options > other page', async () => {

    varList.technologyItems = 'Other robotics or automatic technology'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/robotic-automatic`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Is the other technology robotic or automatic?')
    expect(response.payload).toContain('Robotic')
    expect(response.payload).toContain('Automatic')
  })

  it('user selects \'Robotic\' and Other robotic or automatic technology from tech items -> store user response and redirect to /robotic-eligibility', async () => {
    varList.technologyItems = 'Other robotics or automatic technology'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-automatic`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticAutomatic: 'Robotic', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('robotic-eligibility')
  })
  it('user selects \'Robotic\' and except Other robotic or automatic technology from tech items -> store user response and redirect to /robotic-eligibility', async () => {
    varList.technologyItems = 'Spraying technology'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-automatic`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticAutomatic: 'Robotic', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('robotic-eligibility')
  })
  it('user selects \'Automatic\' -> store user response and redirect to /automatic-eligibility', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotic-automatic`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { roboticAutomatic: 'Automatic', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('automatic-eligibility')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/robotic-automatic`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"technology-items\" class=\"govuk-back-link\">Back</a>')
  })
})
