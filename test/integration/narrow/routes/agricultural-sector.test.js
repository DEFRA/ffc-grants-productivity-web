const { crumbToken } = require('./test-helper')

describe('robotics agricultural sector page', () => {
  const varList = { 
    energySource: 'Mains electricity',
    agriculturalSector: 'randomData'
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
      url: `${global.__URLPREFIX__}/agricultural-sector`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Which agricultural sector is your project in?')
    expect(response.payload).toContain('Horticulture')
    expect(response.payload).toContain('Arable')
    expect(response.payload).toContain('Dairy livestock')
    expect(response.payload).toContain('Non-dairy livestock')
  })

  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agricultural-sector`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select up to 2 sectors your project is in')
  })

  it('3 or more options are selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agricultural-sector`,
      payload: { agriculturalSector: ['Horticulture', 'Arable', 'Dairy livestock'], crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select up to 2 sectors your project is in')
  })

  it('2 options are selected -> store user response and redirect to technology-use page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agricultural-sector`,
      payload: { agriculturalSector: ['Horticulture', 'Arable'], crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('technology-use')
  })

  it('1 option is selected -> store user response and redirect to technology-use page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agricultural-sector`,
      payload: { agriculturalSector: 'Horticulture', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('technology-use')
  })
  it('page loads with correct back link when energy source is mains electricity', async () => {
    varList.energySource = 'Mains electricity'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agricultural-sector`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"energy-source\" class=\"govuk-back-link\">Back</a>')
  })
  it('page loads with correct back link  when energy source is Fossil fuels', async () => {
    varList.energySource = 'Fossil fuels'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agricultural-sector`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"fossil-fuel-conditional\" class=\"govuk-back-link\">Back</a>')
  })
})
