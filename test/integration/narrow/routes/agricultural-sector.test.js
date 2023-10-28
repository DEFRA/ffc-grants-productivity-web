const { extractCleanText, getQuestionCheckboxes } = require('../../../test-helpers')
const { crumbToken } = require('./test-helper')

describe('robotics agricultural sector page', () => {
  const varList = { }

  jest.mock('../../../../app/helpers/functions/session', () => ({
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
    const htmlPage = createPage(response.payload)
    const questionH1 = getQuestionH1(htmlPage)
    const questionAnswers = getQuestionCheckboxes(htmlPage)
    expect(questionAnswers.length).toBe(4)
    expect(extractCleanText(questionH1)).toBe('Which agricultural sector is your project in?')
    expect(questionAnswers[0].value).toBe('Horticulture')
    expect(questionAnswers[1].value).toBe('Arable')
    expect(questionAnswers[2].value).toBe('Dairy livestock')
    expect(questionAnswers[3].value).toBe('Non-dairy livestock')
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
    const htmlPage = createPage(postResponse.payload)
    const questionErrors = getQuestionErrors(htmlPage)
    const targetError = getTargetError(questionErrors, 'Select up to 2 sectors your project is in')
    expect(targetError.length).toBe(1)
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
  it('page loads with correct back link when energy source is ains electricity', async () => {
    varList.energySource = 'Mains electricity'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agricultural-sector`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const htmlPage = createPage(response.payload)
    const backLink = getBackLink(htmlPage)
    expect(extractCleanText(backLink)).toBe('Back')
    expect(backLink.href).toBe('energy-source')
  })
  it('page loads with correct back link  when energy source is Fossil fuels', async () => {
    varList.energySource = 'Fossil fuels'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agricultural-sector`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const htmlPage = createPage(response.payload)
    const backLink = getBackLink(htmlPage)
    expect(extractCleanText(backLink)).toBe('Back')
    expect(backLink.href).toBe('fossil-fuel-conditional')
  })
})
