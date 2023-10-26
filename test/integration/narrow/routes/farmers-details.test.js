const { crumbToken } = require('./test-helper')

describe('Farmer details page', () => {
  const varList = { applying: 'someValue' }

  jest.mock('../../../../app/helpers/session', () => ({
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
      url: `${global.__URLPREFIX__}/farmers-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
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
    expect(postResponse.payload).toContain('Enter your first name')
    expect(postResponse.payload).toContain('Enter your last name')
    expect(postResponse.payload).toContain('Enter your email address')
    expect(postResponse.payload).toContain('Enter a landline number (if you do not have a landline, enter your mobile number)')
    expect(postResponse.payload).toContain('Enter your address line 1')
    expect(postResponse.payload).toContain('Enter your town')
    expect(postResponse.payload).toContain('Select your county')
    expect(postResponse.payload).toContain('Enter your business postcode, like AA1 1AA')
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
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
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
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
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
    expect(postResponse.payload).toContain('Enter an email address in the correct format, like name@example.com')
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
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
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
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
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
    expect(postResponse.payload).toContain('Address must only include letters, numbers, hyphens and apostrophes')
  })

  it('should NOT show error message when address line 1 is valid', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farmers-details`,
      payload: {
        address1: 'Flat 9 Address.,\'',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).not.toContain('Address must only include letters, numbers, hyphens and apostrophes')
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
    expect(postResponse.payload).toContain('Enter a business postcode, like AA1 1AA')
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
    expect(postResponse.payload).toContain('Enter a landline number (if you do not have a landline, enter your mobile number)')
  })
})
