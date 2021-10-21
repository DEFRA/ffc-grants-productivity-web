const { crumbToken } = require('./test-helper')

describe('confirm page', () => {
  const varList = { farmerDetails: 'someValue', contractorsDetails: 'someValue' }

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
      url: `${global.__URLPREFIX__}/confirm`,
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/check-details'
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should store user response and redirects to confirmation page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/confirm`,
      payload: { consentOptional: 'some conscent', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('confirmation')
  })
})
