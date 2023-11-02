const { crumbToken } = require('./test-helper')

describe('robotics Technology page', () => {
  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-use`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you have used this technology on your farm')
  })

  it('store user response and redirect to energy source page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/technology-use`,
      payload: { technology: 'some fake technology', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/score')
  })
})
