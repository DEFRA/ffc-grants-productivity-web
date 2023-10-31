const { crumbToken } = require('./test-helper')

describe('Page: /potential-amount-conditional', () => {
  const varList = {
    roboticAutomatic: 'Robotic'
  }
  const eligiblePageText = 'RPA will assess your item and whether they will fund it.'

  jest.mock('grants-helpers', () => ({
    functions: {
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (varList[key]) return varList[key]
        else return null
      }
    }
  }))

  it('page loads successfully, with all the Eligible options', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/other-conditional`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Your other robotic technology might get a grant from this scheme')
    expect(response.payload).toContain(eligiblePageText)
  })

  it('should redirect to /other-item when user press continue', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/other-conditional`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { otherRoboticsConditional: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('other-item')
  })

  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/other-conditional`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="other-robotic-technology" class="govuk-back-link" id="linkBack">Back</a>')
  })
  it('page loads with correct back link when robotic automatic page is Automatic', async () => {
    varList.roboticAutomatic = 'Automatic'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/other-conditional`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href="other-automatic-technology" class="govuk-back-link" id="linkBack">Back</a>')
  })
})
