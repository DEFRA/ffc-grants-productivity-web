const { getBackLink, getPageErrors, getTargetByText } = require('../../../test-helpers')
const { crumbToken } = require('./test-helper')
const varListTemplate = {
  projectSubject: 'Slurry Acidification'
}
let varList
jest.mock('grants-helpers', () => ({
  functions: {
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return null
    }
  }
}))
describe('Project and business details page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('should diaplay correct hint text for project name, in case of slurry journey ', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/business-details`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const hint = page.querySelector('div.govuk-hint')
    expect(extractCleanText(hint)).toBe(
      'For example, Browns Hill Farm slurry acidification'
    )
  })
  it('should diaplay correct hint text for project name, in case of robotics journey ', async () => {
    varList.projectSubject = 'Robotics and Innovation'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/business-details`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const hint = page.querySelector('div.govuk-hint')
    expect(extractCleanText(hint)).toBe(
      'For example, Browns Hill Farm robotic milking'
    )
  })
  it('should diaplay Back to details buton if the user came from check details page ', async () => {
    varList.reachedCheckDetails = true
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/business-details`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const page = createPage(response.payload)
    const backLink = getBackLink(page)
    expect(extractCleanText(backLink)).toBe('Back')
    expect(backLink.href).toBe('score')
    // back to details button
    expect(response.payload).toContain('Back to details')
    const allButtons = page.querySelectorAll('button.govuk-button')
    const backToDetailsButton = getTargetByText(allButtons, 'Back to details')
    expect(backToDetailsButton.length).toBe(1)
    expect(backToDetailsButton[0].name).toBe('secBtn')
  })
  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(4)
    expect(extractCleanText(errorSummary[0])).toBe('Enter a project name')
    expect(extractCleanText(errorSummary[1])).toBe('Enter a business name')
    expect(extractCleanText(errorSummary[2])).toBe(
      'Enter the number of employees'
    )
    expect(extractCleanText(errorSummary[3])).toBe(
      'Enter the business turnover'
    )
  })
  it('should validate number of employees - only whole numbers', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        numberEmployees: '00123',
        businessTurnover: '1234567',
        businessName: 'Business Name',
        projectName: 'Project Name',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    console.log(errorSummary)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'Number of employees must be a whole number, like 305'
    )
  })
  it('should validate number of employees - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        numberEmployees: '123 45',
        businessTurnover: '1234567',
        businessName: 'Business Name',
        projectName: 'Project Name',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'Number must be between 1-9999999'
    )
  })
  it('should validate number of employees - character limit is 7', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        numberEmployees: '12345678',
        businessTurnover: '1234567',
        businessName: 'Business Name',
        projectName: 'Project Name',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'Number must be between 1-9999999'
    )
  })
  it('should validate business turnover - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        businessTurnover: '0124',
        numberEmployees: '1234567',
        businessName: 'Business Name',
        projectName: 'Project Name',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'Business turnover must be a whole number, like 100000'
    )
  })
  it('should validate business turnover - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        businessTurnover: '123 45',
        numberEmployees: '1234567',
        businessName: 'Business Name',
        projectName: 'Project Name',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'Number must be between 1-999999999'
    )
  })
  it('should validate business turnover - character limit is 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        businessTurnover: '1234567890',
        numberEmployees: '1234567',
        businessName: 'Business Name',
        projectName: 'Project Name',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'Number must be between 1-999999999'
    )
  })
  it('should validate SBI - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123e',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'SBI number must have 9 characters, like 011115678'
    )
  })
  it('should validate SBI - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '123 45',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'SBI number must have 9 characters, like 011115678'
    )
  })
  it('should validate SBI - characters must not be less than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '12345678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'SBI number must have 9 characters, like 011115678'
    )
  })
  it('should validate SBI - characters must not be more than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '1234567890',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'SBI number must have 9 characters, like 011115678'
    )
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })
  it('should store user response and redirects to applicant page, sbi is optional', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/applying`)
  })
  it('should store user response and redirects to applicant page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '012345678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/applying`)
  })
})
