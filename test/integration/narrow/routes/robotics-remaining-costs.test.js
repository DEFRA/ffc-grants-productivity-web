const { crumbToken } = require('./test-helper')

describe('robotics-remaining-costs page', () => {
  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      payload: { canPayRemainingCost: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you can pay the remaining costs without using any other grant money')
  })

  it('user selects: <Yes> -> store user response and redirect to project impact page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      payload: { canPayRemainingCost: 'Yes', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-impact')
  })

  it('user selects: <No> -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/remaining-costs`,
      payload: { canPayRemainingCost: 'No', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })
})
