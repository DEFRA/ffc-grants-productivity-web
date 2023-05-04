const { crumbToken } = require('./test-helper')

describe('Slurry Acidification Infrastructure Page', () => {
  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/slurry/acidification-infrastructure`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you need acidification infrastructure')
  })

  it('store user response and redirect to slurry application page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/slurry/acidification-infrastructure`,
      payload: { acidificationInfrastructure: 'No', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-impacts')
  })
})
