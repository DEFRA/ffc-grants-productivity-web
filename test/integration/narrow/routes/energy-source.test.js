const { crumbToken } = require('./test-helper')

describe('Robotics Energy Source Page', () => {
  const varList = { 
    energySource: ['Biofuels', 'another source']
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
    }
  }))

  it('page loads successfully, with all the options - score', async () => {
    varList['current-score'] = true
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/energy-source`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of energy will you use?')
    expect(response.payload).toContain('Mains electricity')
    expect(response.payload).toContain('Renewable electricity generated on the farm')
    expect(response.payload).toContain('Biofuels')
    expect(response.payload).toContain('Fossil fuels')
  
  })

  it('page loads successfully, with all the options - no score', async () => {
    varList['current-score'] = false

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/energy-source`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What type of energy will you use?')
    expect(response.payload).toContain('Mains electricity')
    expect(response.payload).toContain('Renewable electricity generated on the farm')
    expect(response.payload).toContain('Biofuels')
    expect(response.payload).toContain('Fossil fuels')
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/energy-source`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select up to 2 types of energy your project will use')
  })

  it('should returns error message if more than 2 options selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/energy-source`,
      payload: { energySource: ['some source', 'another source', 'energy source 3'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select up to 2 types of energy your project will use')
  })

  it('should store user response and redirects to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/energy-source`,
      payload: { energySource: ['some source', 'another source'], crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('agricultural-sector')
  })

  it('should store user response and redirects to project cost page', async () => {
    varList.energySource = ['Fossil fuels', 'Mains electricity']
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/energy-source`,
      payload: { energySource: ['Fossil fuels', 'Mains electricity'], crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('fossil-fuel-conditional')
  })
})
