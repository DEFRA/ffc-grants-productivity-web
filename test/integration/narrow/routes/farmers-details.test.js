const { crumbToken } = require('./test-helper')
describe('Farmer details page', () => {
  const varList = { applying: 'someValue' }
  jest.mock('../../../../app/helpers/functions/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/farmers-details`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const htmlPage = createPage(response.payload)
    const heading = htmlPage.querySelectorAll('h1.govuk-heading-l')
    const mainHeading = getTargetByText(heading, 'Farmer’s details')
    expect(mainHeading.length).toBe(1)
    const answers = getQuestionLabels(htmlPage)
    expect(answers.length).toBe(11)
    expect(extractCleanText(answers[0])).toBe('First name')
    expect(extractCleanText(answers[1])).toBe('Last name')
    expect(extractCleanText(answers[2])).toBe('Email address')
    expect(extractCleanText(answers[3])).toBe('Mobile number')
    expect(extractCleanText(answers[4])).toBe('Landline number')
    expect(extractCleanText(answers[5])).toBe('Address line 1')
    expect(extractCleanText(answers[6])).toBe('Address line 2 (optional)')
    expect(extractCleanText(answers[7])).toBe('Town')
    expect(extractCleanText(answers[8])).toBe('County')
    expect(extractCleanText(answers[9])).toBe('Business postcode')
    expect(extractCleanText(answers[10])).toBe('Project postcode')
  })
  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errorMessages = getQuestionErrors(htmlPage)
    expect(errorMessages.length).toBe(10)
    expect(extractCleanText(errorMessages[0])).toBe('Enter your first name')
    expect(extractCleanText(errorMessages[1])).toBe('Enter your last name')
    expect(extractCleanText(errorMessages[2])).toBe(
      'Enter your email address'
    )
    expect(extractCleanText(errorMessages[3])).toBe(
      'Enter a mobile number (if you do not have a mobile, enter your landline number)'
    )
    expect(extractCleanText(errorMessages[4])).toBe(
      'Enter a landline number (if you do not have a landline, enter your mobile number)'
    )
    expect(extractCleanText(errorMessages[5])).toBe(
      'Enter your address line 1'
    )
    expect(extractCleanText(errorMessages[6])).toBe('Enter your town')
    expect(extractCleanText(errorMessages[7])).toBe('Select your county')
    expect(extractCleanText(errorMessages[8])).toBe(
      'Enter your business postcode, like AA1 1AA'
    )
    expect(extractCleanText(errorMessages[9])).toBe(
      'Enter your project postcode, like AA1 1AA'
    )
  })
  it('should validate first name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        firstName: '123',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errorMessages = getQuestionErrors(htmlPage)
    const error = getTargetByText(errorMessages, 'Name must only include letters, hyphens and apostrophes')
    expect(error.length).toBe(1)
  })
  it('should validate last name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        lastName: '123',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errorMessages = getQuestionErrors(htmlPage)
    const error = getTargetByText(errorMessages, 'Name must only include letters, hyphens and apostrophes')
    expect(error.length).toBe(1)
  })
  it('should validate email', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        emailAddress: 'my@@name.com',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errorMessages = getQuestionErrors(htmlPage)
    const error = getTargetByText(errorMessages, 'Enter an email address in the correct format, like name@example.com')
    expect(error.length).toBe(1)
  })
  it('should validate landline - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        landlineNumber: '12345679a0${',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errorMessages = getQuestionErrors(htmlPage)
    const error = getTargetByText(errorMessages, 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
    expect(error.length).toBe(1)
  })
  it('should validate mobile correct format - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        mobileNumber: '07700:?$900 982',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errorMessages = getQuestionErrors(htmlPage)
    const error = getTargetByText(errorMessages, 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
    expect(error.length).toBe(1)
  })
  it('should show error message when address line 1 is invalid', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        address1: 'Flat 9/?:;',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errorMessages = getQuestionErrors(htmlPage)
    const error = getTargetByText(errorMessages, 'Address must only include letters, numbers, hyphens and apostrophes')
    expect(error.length).toBe(1)
  })
  it('should NOT show error message when address line 1 is valid', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        address1: "Flat 9 Address.,'",
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errorMessages = getQuestionErrors(htmlPage)
    const error = getTargetByText(
      errorMessages,
      'Address must only include letters, numbers, hyphens and apostrophes'
    )
    expect(error.length).toBe(0)
  })
  it('should validate postcode - raise error when postcode is invalid', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        postcode: 'aa1aa',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const htmlPage = createPage(postResponse.payload)
    const errorMessages = getQuestionErrors(htmlPage)
    const error = getTargetByText(errorMessages, 'Enter a business postcode, like AA1 1AA')
    expect(error.length).toBe(1)
  })
  it('should store user response and redirects to check details page, either of mobile or landline can be empty', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        emailAddress: 'my@name.com',
        mobileNumber: '07700 900 982',
        address1: 'Address 1',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('check-details')
  })
  it('should store user response and redirects to ckeck details page, either of mobile or landline can be empty', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        emailAddress: 'my@name.com',
        landlineNumber: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('check-details')
  })
  it('should store user response and redirects to check details page , either of mobile or landline can be empty', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        emailAddress: 'my@name.com',
        landlineNumber: '44 0808 157 0192',
        mobileNumber: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('check-details')
  })
  it('should be validate - if both mobile and landline are missing', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
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
    const errorMessages = getQuestionErrors(htmlPage)
    const error = getTargetByText(
      errorMessages,
      'Enter a mobile number (if you do not have a mobile, enter your landline number)'
    )
    expect(error.length).toBe(1)
  })
})
