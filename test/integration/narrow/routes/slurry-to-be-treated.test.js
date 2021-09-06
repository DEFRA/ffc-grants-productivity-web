const { crumbToken } = require('./test-helper')

describe('slurry-to-be-treated page', () => {
  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/slurry/slurry-to-be-treated`,
      payload: { projectPostcode: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the volume of digestate you will acidify after the project')
  })

  it('should returns error message if the user do not eneter a whole number ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/slurry/slurry-to-be-treated`,
      payload: { slurryToBeTreated: '20.78', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be a number')
  })

  it('should returns error message if volume is contains letters or other charachters ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/slurry/slurry-to-be-treated`,
      payload: { slurryToBeTreated: '23rep +&', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be a number')
  })

  it('should store user response and redirects to planning permission page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/slurry/slurry-to-be-treated`,
      payload: { slurryToBeTreated: '560', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/productivity/score')
  })
})
