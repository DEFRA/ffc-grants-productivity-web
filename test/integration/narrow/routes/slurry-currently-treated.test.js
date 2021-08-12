const { crumbToken } = require('./test-helper')

describe('slurry-to-be-treated page', () => {
  it('should returns error message if nothing entered in the input', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/slurry/slurry-currently-treated`,
      payload: { slurryCurrentlyTreated: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the volume of slurry or digestate you currently acidify')
  })

  it('should returns error message if the user writes decimals ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/slurry/slurry-currently-treated`,
      payload: { slurryCurrentlyTreated: '100.18', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be a whole number')
  })

  it('should returns error message if the user writes alphabets', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/slurry/slurry-currently-treated`,
      payload: { slurryCurrentlyTreated: 'currently123', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be a whole number')
  })



  it('should returns error message if the user writes  specific characters', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/slurry/slurry-currently-treated`,
      payload: { slurryCurrentlyTreated: '$&12', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Volume must be a whole number')
  })

})