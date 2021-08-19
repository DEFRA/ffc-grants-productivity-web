const { crumbToken } = require('./test-helper')

describe('Robotics project items page', () => {
  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/project-items`,
      payload: { projectPurchase: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select all the items your project needs')
  })

  it('should store user response and redirects to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/project-items`,
      payload: { projectItems: ['some items', 'another item'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
  })
})
