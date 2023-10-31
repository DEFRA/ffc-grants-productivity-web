const { crumbToken } = require('./test-helper')

describe('project-start', () => {
  const varList = {
    projectSubject: 'Robotics and Innovation',
    applicant: 'Farmer'
  }

  jest.mock('grants-helpers', () => ({
    functions: {
      setYarValue: (request, key, value) => null,
      getYarValue: (request, key) => {
        if (varList[key]) return varList[key]
        else return null
      }
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
    const page = createPage(postResponse.payload)
    const errors = getPageErrors(page)
    const error = getTargetByText(errors, 'Select the option that applies to your project')
    expect(error.length).toBe(1)
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
    expect(postResponse.headers.location).toBe('tenancy')
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
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const headings = page.querySelectorAll('h1')
    const heading = getTargetByText(
      headings,
      'You cannot apply for a grant from this scheme'
    )
    expect(heading.length).toBe(1)
  })
})
