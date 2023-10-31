const { crumbToken } = require('./test-helper')
describe('business location page', () => {
  // it('should load the page successfully', async () => {
  //   // expect.assertions(4)
  //   const getResponse = await global.__SERVER__.inject({
  //     method: 'GET',
  //     url: `${global.__URLPREFIX__}/business-location`,
  //     payload: { crumb: crumbToken, applicant: 'Contractor' },
  //     headers: {
  //       cookie: 'crumb=' + crumbToken
  //     }
  //   })
  //   // expect(getResponse.statusCode).toBe(200)
  //   const page = createPage(getResponse.payload)
  //   expect(getResponse.payload).toContain('Is the business in England?')
  //   const heading = page.querySelector('h1.govuk-heading-l')
  //   // expect(extractCleanText(heading)).toBe("Is the business in England?");
  //   const answers = getPageRadios(page)
  //   expect(answers.length).toBe(2)
  //   expect(answers[0].nextElementSibling.textContent).toBe('Yes')
  //   expect(answers[1].nextElementSibling.textContent).toBe('No')
  // })
  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-location`,
      payload: { businessLoctation: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    const page = createPage(postResponse.payload)
    const errorSummary = getPageErrors(page)
    expect(errorSummary.length).toBe(1)
    expect(extractCleanText(errorSummary[0])).toBe(
      'Select yes if the business is in England'
    )
  })
  it('should display ineligible page when user response is \'No\'', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-location`,
      payload: { businessLocation: 'No', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    const page = createPage(postResponse.payload)
    expect(postResponse.statusCode).toBe(200)
    const headings = page.querySelectorAll('h1.govuk-heading-l')
    const mainHeading = getTargetByText(headings, 'You cannot apply for a grant from this scheme')
    expect(mainHeading).not.toBeNull()
  })
  it('should store user response and redirects to planning permission page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-location`,
      payload: { businessLocation: 'Yes', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('legal-status')
  })
})
