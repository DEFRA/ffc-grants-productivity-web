const { crumbToken } = require('./test-helper')

describe('agricultural sector solar page', () => {
  let varList = {
    remainingCosts: 120000
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return null
    }
  }))
  it('page loads successfully, with all the options - with score', async () => {
    varList['current-score'] = true
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agricultural-sector-solar`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Which agricultural sector is your project in?')
    expect(response.payload).toContain('Arable')
    expect(response.payload).toContain('Beef')
    expect(response.payload).toContain('Dairy livestock')
    expect(response.payload).toContain('Horticulture')
    expect(response.payload).toContain('Mixed livestock')
    expect(response.payload).toContain('Pig')
    expect(response.payload).toContain('Poultry')
    expect(response.payload).toContain('Sheep')
  })

  it('page loads successfully, with all the options - no score', async () => {
    varList['current-score'] = false

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agricultural-sector-solar`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What do you farm mainly?')
    expect(response.payload).toContain('Arable')
    expect(response.payload).toContain('Beef')
    expect(response.payload).toContain('Dairy livestock')
    expect(response.payload).toContain('Horticulture')
    expect(response.payload).toContain('Mixed livestock')
    expect(response.payload).toContain('Pig')
    expect(response.payload).toContain('Poultry')
    expect(response.payload).toContain('Sheep')
  })
  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agricultural-sector-solar`,
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
      url: `${global.__URLPREFIX__}/agricultural-sector-solar`,
      payload: {
        agriculturalSector: ['Horticulture', 'Arable', 'Dairy livestock'],
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select up to 2 sectors your project is in')
  })
  it('2 options are selected -> store user response and redirect to score page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agricultural-sector-solar`,
      payload: { agriculturalSector: ['Horticulture', 'Arable'], crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('score')
  })
  it('1 option is selected -> store user response and redirect to score page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agricultural-sector-solar`,
      payload: { agriculturalSector: 'Horticulture', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('score')
  })
  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agricultural-sector-solar`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"remaining-costs-solar\" class=\"govuk-back-link\">Back</a>')
  })
})
