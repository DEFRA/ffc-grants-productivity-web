const { crumbToken } = require('./test-helper')

describe('slurry-currently-treated', () => {
  it('it should return error message if the input is empty', async () => {
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
})
