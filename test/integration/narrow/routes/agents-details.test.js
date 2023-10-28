const { extractCleanText, getTargetError } = require('../../../test-helpers')
const { crumbToken } = require('./test-helper')

describe('Agent details page', () => {
  const varList = {
    applicant: 'Farmer',
    applying: 'Agent'
  }

  jest.mock('../../../../app/helpers/functions/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      console.log(key, 'key')
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agents-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errors = getQuestionErrors(htmlPage)
    console.log('here: ', errors)
    expect(errors.length).toBe(10)
    expect(extractCleanText(errors[0])).toContain('Enter your first name')
    expect(extractCleanText(errors[1])).toContain('Enter your last name')
    expect(extractCleanText(errors[2])).toContain('Enter your business name')
    expect(extractCleanText(errors[3])).toContain('Enter your email address')
    expect(extractCleanText(errors[4])).toContain(
      'Enter a mobile number (if you do not have a mobile, enter your landline number)'
    )
    expect(extractCleanText(errors[5])).toContain(
      'Enter a landline number (if you do not have a landline, enter your mobile number)'
    )
    expect(extractCleanText(errors[6])).toContain('Enter your address line 1')
    expect(extractCleanText(errors[7])).toContain('Enter your town')
    expect(extractCleanText(errors[8])).toContain('Select your county')
    expect(extractCleanText(errors[9])).toContain(
      'Enter your postcode, like AA1 1AA'
    )
  })

  it('should validate first name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        firstName: '123',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errors = getQuestionErrors(htmlPage)
    const targetError = getTargetError(errors,
      'Name must only include letters, hyphens and apostrophes')
    expect(targetError.length).toBe(1)
  })

  it('should validate last name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        lastName: '123',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errors = getQuestionErrors(htmlPage)
    const targetError = getTargetError(errors,
      'Name must only include letters, hyphens and apostrophes')
    expect(targetError.length).toBe(1)
  })

  it('should validate email', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        emailAddress: 'my@@name.com',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errors = getQuestionErrors(htmlPage)
    const targetError = getTargetError(errors,
      'Enter an email address in the correct format, like name@example.com'
    )
    expect(targetError.length).toBe(1)
  })

  it('should validate landline - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        landlineNumber: '12345679a0${',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errors = getQuestionErrors(htmlPage)
    const targetError = getTargetError(errors,
      'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
    )
    expect(targetError.length).toBe(1)
  })

  it('should validate mobile correct format - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        mobileNumber: '07700:?$900 982',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errors = getQuestionErrors(htmlPage)
    const targetError = getTargetError(errors,
      'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
    )
    expect(targetError.length).toBe(1)
  })

  it('should show error message when address line 1 is invalid', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        address1: 'Flat 9/?:;',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errors = getQuestionErrors(htmlPage)
    const targetError = getTargetError(errors,
      'Address must only include letters, numbers, hyphens and apostrophes'
    )
    expect(targetError.length).toBe(1)
    // expect(postResponse.payload).toContain(
    //   "Address must only include letters, numbers, hyphens and apostrophes"
    // );
  })

  it('should NOT show error message when address line 1 is valid', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        address1: "Flat 9 Address.,'",
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errors = getQuestionErrors(htmlPage)
    const targetError = getTargetError(errors,
      'Address must only include letters, numbers, hyphens and apostrophes'
    )
    expect(targetError.length).toBe(0)
  })

  it('should validate postcode - raise error when postcode is invalid', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        postcode: 'aa1aa',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errors = getQuestionErrors(htmlPage)
    const targetError = getTargetError(errors,
      'Enter a postcode, like AA1 1AA'
    )
    expect(targetError.length).toBe(1)
  })

  it('should store user response and redirects to farmer details page , either of mobile or landline can be empty', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'Business Name',
        emailAddress: 'my@name.com',
        mobileNumber: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/productivity/farmers-details')
  })
  it('should store user response and redirects to farmer details page, if the applicant is farmer', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'Business Name',
        emailAddress: 'my@name.com',
        mobileNumber: '07700 900 982',
        address1: 'Address 1',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/productivity/farmers-details')
  })

  it('should store user response and redirects to contractor details page, if the applicant is contractor', async () => {
    varList.applicant = 'Contractor'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'Business Name',
        emailAddress: 'my@name.com',
        landlineNumber: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(
      '/productivity/contractors-details'
    )
  })

  it('should be validate - if both mobile and landline are missing', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agents-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'Business Name',
        emailAddress: 'my@name.com',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errors = getQuestionErrors(htmlPage)
    const targetError1 = getTargetError(errors,
      'Enter a mobile number (if you do not have a mobile, enter your landline number)'
    )
    expect(targetError1.length).toBe(1)
  })
})
