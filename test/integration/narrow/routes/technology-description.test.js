const { crumbToken } = require('./test-helper')

describe('Page: /technology-description', () => {
    const varList = {
        otherItem: 'randomData',
        projectItemsList: [],
        projectItems: ['Robotic and automatic technology'],
        technologyItems: 'Harvesting technology',
        roboticAutomatic: 'Automatic',
        automaticEligibility: ['Has sensing system that can understand its environment', 'Makes decisions and plans', 'Can control its actuators (the devices that move robotic joints)', 'Works in a continuous loop'],
        roboticEligibility: 'Yes',
        technologyDescription: 'some fake description some fake description',
        addToItemList: true
    }

    jest.mock('../../../../app/helpers/session', () => ({
        setYarValue: (request, key, value) => null,
        getYarValue: (request, key) => {
            if (varList[key]) return varList[key]
            else return undefined
    }
}))

it('page loads successfully, with all options', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/technology-description`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What is your technology?')
})

it('should return error message if no option is selected', async () => {
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/technology-description`,
        payload: { crumb: crumbToken },
        headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a brief description of your technology')
})

it('should redirect to /other-items - normal vals', async () => {
    varList.otherItem = 'No'
    varList.projectItemsList = ['Harvesting technology', "Weeding technology"]
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/technology-description`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { description: 'fakeDescription', projectItemsList: ['Harvesting technology', "Weeding technology"], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('other-item')
})

it('should redirect to /other-items - null values', async () => {
    varList.otherItem = 'No'
    varList.projectItemsList = ['Harvesting technology', "Weeding technology"]
    varList.roboticEligibility = 'No'
    varList.technologyItems = 'Other robotics or automatic technology'
    varList.automaticEligibility = null
    varList.roboticAutomatic = null
    varList.technologyDescription = null
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/technology-description`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { description: 'fake description', projectItemsList: ['Harvesting technology', "Weeding technology"], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('other-item')
})
it('page loads with correct back link > automatic', async () => {
  varList.roboticEligibility = null
  varList.automaticEligibility = 'value'
  varList.roboticAutomatic = 'Automatic'  
  const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/technology-description`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"automatic-eligibility\" class=\"govuk-back-link\">Back</a>' )
    })


it('page loads with correct back link > robotic', async () => {
  varList.roboticEligibility = 'value'
  varList.automaticEligibility = null
  varList.roboticAutomatic = 'Robotic'
  const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/technology-description`
  }
  const response = await global.__SERVER__.inject(options)
  expect(response.statusCode).toBe(200)
  expect(response.payload).toContain('<a href=\"robotic-eligibility\" class=\"govuk-back-link\">Back</a>' )
  })
})
