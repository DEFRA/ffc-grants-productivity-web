const { crumbToken } = require('./test-helper')

const varListTemplate = {
  projectSubject: 'Farm productivity project items',
  legalStatus: 'fale status',
  projectItems: ['Advanced ventilation control units', 'Wavelength-specific LED lighting for horticultural crops'],
  projectCost: '12345678',
  technologyItems: '12345',
  projectItemsList: [
    {
        item: 'hello',
        type: 'Robotic',
        index: 0
    },
    {
        item: 'hello',
        type: 'sdjfhaf',
        index: 1
    }
],
}

let varList
const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return undefined
  }
}

jest.mock('../../../../app/helpers/session', () => mockSession)

describe('Project cost robotics page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should load page successfully - eligible items', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page successfully - only ineligble items', async () => {
    varList.projectItems = 'Robotic and automatic technology'
    varList.projectItemsList = [
      {
          item: 'Other item',
          type: 'Robotic',
          index: 0
      },
      {
          item: 'Other item',
          type: 'Automatic',
          index: 1
      }
    ]

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page successfully if no projectCost', async () => {
    varList.projectCost = undefined

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })
  it('should return an error message if no option is selected', async () => {
    varList['current-score'] = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the total estimated cost for the items')
  })

  it('should return an error message if a string is typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '1234s6', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should return an error message if number contains a space', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '1234 6', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should eliminate user if the cost entered is too low', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '12', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('should redirected to the Potential funding page if the cost entered is too high', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '9999999', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    console.log('payload: ', postResponse.payload)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('potential-amount')
  })
  it('should store valid user input and redirect to potential-amount page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost`,
      payload: { projectCost: '1234567', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('potential-amount')
})
it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/project-cost`
    }

const response = await global.__SERVER__.inject(options)
expect(response.statusCode).toBe(200)
expect(response.payload).toContain('<a href=\"project-items\" class=\"govuk-back-link\">Back</a>')
})
it('should display the "Robotic voluntary milking system" in the sidebar, if user selects "Voluntary robotic milking system"', async () => {
  varList.projectItems = 'Robotic and automatic technology'
  varList.projectItemsList = [
    {
        item: 'Voluntary robotic milking system',
        type: 'Robotic',
        index: 0
    }
  ]
  const options = {
    method: 'GET',
    url: `${global.__URLPREFIX__}/project-cost`
  }
  const response = await global.__SERVER__.inject(options)
  expect(response.statusCode).toBe(200)
  expect(response.payload).toContain('Robotic voluntary milking system')
})

// it('page loads with correct back link when Solar project items is /Solar panels/ ', async () => {
//   varList.solarTechnologies = 'Solar panels'
//   varList.solarInstallation = 'On an existing hardstanding area'
//   const options = {
//       method: 'GET',
//       url: `${global.__URLPREFIX__}/project-cost`
//   }

// const response = await global.__SERVER__.inject(options)
// expect(response.statusCode).toBe(200)
// expect(response.payload).toContain('<a href=\"solar-output\" class=\"govuk-back-link\">Back</a>')
// })
})
