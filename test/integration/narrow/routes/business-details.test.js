const { crumbToken } = require('./test-helper')

describe('Project and business details page', () => {
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
    expect(postResponse.payload).toContain('Enter a project name')
    expect(postResponse.payload).toContain('Enter a business name')
    expect(postResponse.payload).toContain('Enter the number of employees')
    expect(postResponse.payload).toContain('Enter the business turnover')
  })

  it('should validate number of employees - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        numberEmployees: '123e',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Employee number must be 7 digits or fewer')
  })

  it('should validate number of employees - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        numberEmployees: '123 45',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Employee number must be 7 digits or fewer')
  })

  it('should validate number of employees - character limit is 7', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        numberEmployees: '12345678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Employee number must be 7 digits or fewer')
  })

  it('should validate business turnover - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        businessTurnover: '123e',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be 9 digits or fewer')
  })

  it('should validate business turnover - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        businessTurnover: '123 45',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be 9 digits or fewer')
  })

  it('should validate business turnover - character limit is 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        businessTurnover: '1234567890',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be 9 digits or fewer')
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
        inSbi: 'Yes',
        sbi: '123e',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
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
        inSbi: 'Yes',
        sbi: '123 45',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
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
        inSbi: 'Yes',
        sbi: '12345678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
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
        inSbi: 'Yes',
        sbi: '1234567890',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
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
        inSbi: 'No',
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
        inSbi: 'Yes',
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