const { crumbToken } = require('./test-helper')

describe('project-start', () => {
  const varList = {
    projectSubject: 'Robotics and Innovation',
    applicant: 'Farmer'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      console.log(key, 'key')
      if (varList[key]) return varList[key]
      else return 'Error'
    }
  }))
  it('no option is selected -> return error message', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { projectStart: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the option that applies to your project')
  })

  it('store user response and redirect to tenancy page if applicant is Farmer', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { projectStart: 'Yes, preparatory work', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('tenancy')
  })

  it('store user response and redirect to project items page if applicant is Contractor', async () => {
    varList.applicant = 'Contractor'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { projectStart: 'Yes, preparatory work', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('robotics/project-items')
  })

  it('store user response and redirect to slurry project items page if applicant is Contractor', async () => {
    varList.projectSubject = 'Slurry Acidification'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { projectStart: 'Yes, preparatory work', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('robotics/project-items')
  })

  it('user selects option 2: <Yes, we have begun project work> -> display ineligible page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { projectStart: 'Yes, we have begun project work', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })
})
