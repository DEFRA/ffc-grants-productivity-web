const { crumbToken } = require('./test-helper')

describe('project purchase page', () => {
  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/project-purchase`,
      payload: { projectPurchase: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the type of new technology your project needs')
  })

  it('should store user response and redirects to planning permission page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/project-purchase`,
      payload: { projectPurchase: 'some equipment', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-items')
  })

  it('should display ineligible page when user response is \'None of the Above\'', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/robotics/project-purchase`,
      payload: { projectPurchase: 'None of the above', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })
})
