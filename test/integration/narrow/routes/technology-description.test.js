const { crumbToken } = require('./test-helper')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
describe('Page: /technology-description', () => {
  const varList = {
    otherItem: 'randomData',
    projectItemsList: [],
    projectItems: ['Robotic and automatic technology'],
    technologyItems: 'Harvesting technology',
    roboticAutomatic: 'Automatic',
    automaticEligibility: ['Has sensing system that can understand its environment', 'Makes decisions and plans', 'Can control its actuators (the devices that move robotic joints)', 'Works in a continuous loop'],
    roboticEligibility: 'Yes',
    technologyDescription: {
        itemName: '',
        brand: '',
        model: '',
        numberOfItems: '',
    },
    addToItemList: true
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return undefined
  }}))


const testTitle = async (title, expectedTitle) => {
    varList.technologyItems = title
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/technology-description`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    let page = new JSDOM(response.payload).window.document
    const heading = page.querySelectorAll('.govuk-heading-l')[1]
    expect(heading.textContent.trim()).toBe(expectedTitle)
}

  it('page loads successfully with Harvesting technology', async () => {
    testTitle('Harvesting technology', 'Describe the harvesting technology')
  })
  it('page loads successfully with Weeding technology', async () => {
    testTitle("Weeding technology", 'Describe the weeding technology')
  })
  it('page loads successfully with Transplanting technology', async () => {
    testTitle("Transplanting technology", 'Describe the transplanting technology')
  })
  it('page loads successfully with Driverless robotic tractor or platform', async () => {
    testTitle("Driverless robotic tractor or platform", 'Describe the driverless robotic tractor or platform')
  })
  it('page loads successfully with obotic spraying technology', async () => {
    testTitle("Robotic spraying technology", 'Describe the robotic spraying technology')
  })
  it('page loads successfully with Voluntary robotic milking system', async () => {
    testTitle("Voluntary robotic milking system", 'Describe the voluntary robotic milking system')
  })
  it('page loads successfully with Feeding robots', async () => {
    testTitle("Feeding robots", 'Describe the feeding robots')
  })
  it('page loads successfully with Slurry robots', async () => {
    testTitle("Slurry robots", 'Describe the slurry robots')
  })

  it('page loads successfully, with robotic title', async () => {
    varList.roboticAutomatic = 'Robotic'
    varList.technologyItems = 'Other robotics or automatic technology'
      const options = {
          method: 'GET',
          url: `${global.__URLPREFIX__}/technology-description`
      }

      const response = await global.__SERVER__.inject(options)
      expect(response.statusCode).toBe(200)
      let page = new JSDOM(response.payload).window.document
      const heading = page.querySelectorAll('.govuk-heading-l')[1]
      expect(heading.textContent.trim()).toBe('Describe the robotic technology')
  })
  it('page loads successfully, with automatic title', async () => {
    varList.technologyItems = 'Other robotics or automatic technology'
    varList.roboticAutomatic = 'Automatic'
      const options = {
          method: 'GET',
          url: `${global.__URLPREFIX__}/technology-description`
      }

      const response = await global.__SERVER__.inject(options)
      expect(response.statusCode).toBe(200)
      let page = new JSDOM(response.payload).window.document
      const heading = page.querySelectorAll('.govuk-heading-l')[1]
      expect(heading.textContent.trim()).toBe('Describe the automatic technology')
  })
  it('should display an error message if itemName is missing', async () => {
    varList.technologyItems = 'Harvesting technology',

    varList.roboticAutomatic = 'Robotic'

      const postOptions = {
          method: 'POST',
          url: `${global.__URLPREFIX__}/technology-description`,
          payload: {
            crumb: crumbToken,
            itemName: '',
            brand: '',
            model: '',
            numberOfItems: '1',
          },
          headers: { cookie: 'crumb=' + crumbToken }
      }

      const postResponse = await global.__SERVER__.inject(postOptions)
      expect(postResponse.statusCode).toBe(200)
      const page = new JSDOM(postResponse.payload).window.document
      const errorSummary = page.querySelector('.govuk-error-summary__list')
      const errors = errorSummary.querySelectorAll('li')
      expect(errors.length).toBe(1)
      expect(errors[0].textContent.trim()).toBe('Enter the name of the item')
  })
  it('should display an error message if itemName is is shorter than 4 or longer than 18', async () => {
    varList.roboticAutomatic = 'Automatic'

      const postOptions = {
          method: 'POST',
          url: `${global.__URLPREFIX__}/technology-description`,
          payload: {
            crumb: crumbToken,
            itemName: '123',
            brand: '',
            model: '',
            numberOfItems: '1',
          },
          headers: { cookie: 'crumb=' + crumbToken }
      }

      const postResponse = await global.__SERVER__.inject(postOptions)
      expect(postResponse.statusCode).toBe(200)
      let page = new JSDOM(postResponse.payload).window.document
      const errorSummary = page.querySelector('.govuk-error-summary__list')
      const errors = errorSummary.querySelectorAll('li')
      expect(errors.length).toBe(1)
      expect(errors[0].textContent.trim()).toBe('Name of item must be between 4 and 18 characters')
      
      postOptions.payload.itemName = '12345678901234567890'
      const postResponse2 = await global.__SERVER__.inject(postOptions)
      expect(postResponse2.statusCode).toBe(200)
      page = new JSDOM(postResponse2.payload).window.document
      const errorSummary2 = page.querySelector('.govuk-error-summary__list')
      const errors2 = errorSummary2.querySelectorAll('li')
      expect(errors2.length).toBe(1)
      expect(errors2[0].textContent.trim()).toBe('Name of item must be between 4 and 18 characters')
  })
  it('should display an error message if brand field has value AND is longer than 18', async () => {
      const postOptions = {
          method: 'POST',
          url: `${global.__URLPREFIX__}/technology-description`,
          payload: {
            crumb: crumbToken,
            itemName: '1234',
            brand: '1234567890123456789',
            model: '',
            numberOfItems: '1',
          },
          headers: { cookie: 'crumb=' + crumbToken }
      }

      const postResponse = await global.__SERVER__.inject(postOptions)
      expect(postResponse.statusCode).toBe(200)
      let page = new JSDOM(postResponse.payload).window.document
      let errorSummary = page.querySelector('.govuk-error-summary__list')
      let errors = errorSummary.querySelectorAll('li')
      expect(errors.length).toBe(1)
      expect(errors[0].textContent.trim()).toBe('Brand must be 18 characters or less')
      
      postOptions.payload.itemName = '12345678901234567890'
      const postResponse2 = await global.__SERVER__.inject(postOptions)
      expect(postResponse2.statusCode).toBe(200)
      page = new JSDOM(postResponse.payload).window.document
      errorSummary = page.querySelector('.govuk-error-summary__list')
      errors = errorSummary.querySelectorAll('li')
      expect(errors.length).toBe(1)
      expect(errors[0].textContent.trim()).toBe('Brand must be 18 characters or less')
  })

  it('should display an error message if number of items field has value AND is longer than 100', async () => {
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/technology-description`,
        payload: {
          crumb: crumbToken,
          itemName: '1234',
          brand: '',
          model: '',
          numberOfItems: '101',
        },
        headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    let page = new JSDOM(postResponse.payload).window.document
    let errorSummary = page.querySelector('.govuk-error-summary__list')
    let errors = errorSummary.querySelectorAll('li')
    expect(errors.length).toBe(1)
    expect(errors[0].textContent.trim()).toBe('Number of items must be between 0 and 100')

})

it('should redirect to /project-items-summary - normal vals', async () => {
    varList.otherItem = 'No'
    varList.projectItemsList = ['Harvesting technology', "Weeding technology"]
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/technology-description`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { itemName: '1234',
            brand: '1234567',
            model: '',
            numberOfItems: '1', 
            crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('project-items-summary')
})

it('should redirect to /project-items-summary - null values', async () => {
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
        payload: { itemName: '1234',
            brand: '123456',
            model: '',
            numberOfItems: '1', 
            crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('project-items-summary')
})

it('should redirect to /project-items-summary - addToItems false', async () => {
    varList.addToItemList = false
    varList.projectItemsList = ['Harvesting technology', "Weeding technology"]

    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/technology-description`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { itemName: '1234',
            brand: '123456',
            model: '',
            numberOfItems: '1', 
            crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('project-items-summary')
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
