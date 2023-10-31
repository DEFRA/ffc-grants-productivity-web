const { crumbToken } = require('./test-helper')
describe('agricultural sector solar page', () => {
  const varList = {
    remainingCosts: 120000
  }
  jest.mock('grants-helpers', () => ({
    functions: {
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (varList[key]) return varList[key]
        else return null
      }
    }
  }))
  it('page loads successfully, with all the options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agricultural-sector-solar`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const htmlPage = createPage(response.payload)
    const h1 = getPageHeading(htmlPage)
    const checkboxes = getPageCheckboxes(htmlPage)
    expect(h1.textContent.trim()).toEqual(
      'Which agricultural sector is your project in?'
    )
    expect(checkboxes.length).toEqual(8)
    expect(checkboxes[0].value).toEqual('Arable')
    expect(checkboxes[1].value).toEqual('Beef')
    expect(checkboxes[2].value).toEqual('Dairy livestock')
    expect(checkboxes[3].value).toEqual('Horticulture')
    expect(checkboxes[4].value).toEqual('Mixed livestock')
    expect(checkboxes[5].value).toEqual('Pig')
    expect(checkboxes[6].value).toEqual('Poultry')
    expect(checkboxes[7].value).toEqual('Sheep')
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
    const htmlPage = createPage(postResponse.payload)
    const errors = getPageErrors(htmlPage)
    expect(errors.length).toEqual(1)
    expect(errors[0].textContent.trim()).toEqual(
      'Select up to 2 sectors your project is in'
    )
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
    const htmlPage = createPage(postResponse.payload)
    const errors = getPageErrors(htmlPage)
    expect(errors.length).toEqual(1)
    expect(errors[0].textContent.trim()).toEqual(
      'Select up to 2 sectors your project is in'
    )
  })
  it('2 options are selected -> store user response and redirect to score page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agricultural-sector-solar`,
      payload: {
        agriculturalSector: ['Horticulture', 'Arable'],
        crumb: crumbToken
      },
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
    const htmlPage = createPage(response.payload)
    const backLink = getBackLink(htmlPage)
    expect(backLink.textContent.trim()).toEqual('Back')
    expect(backLink.href).toEqual('remaining-costs-solar')
  })
})
