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
  it('page loads successfully, with all options', async () => {
      const options = {
          method: 'GET',
          url: `${global.__URLPREFIX__}/technology-description`
      }

      const response = await global.__SERVER__.inject(options)
      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain('Describe the Automatic technology')
  })


  it('should display an error message if itemName is missing', async () => {
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
      const errorSummary = page.querySelector('.govuk-error-summary__list')
      const errors = errorSummary.querySelectorAll('li')
      expect(errors.length).toBe(1)
      expect(errors[0].textContent.trim()).toBe('Brand must be 18 characters or less')
      
      postOptions.payload.itemName = '12345678901234567890'
      const postResponse2 = await global.__SERVER__.inject(postOptions)
      expect(postResponse2.statusCode).toBe(200)
      expect(postResponse2.payload).toContain('Brand must be 18 characters or less')
  })

  it('should redirect to /other-items - normal vals', async () => {
      varList.otherItem = 'No'
      varList.projectItemsList = ['Harvesting technology', "Weeding technology"]
      const postOptions = {
          method: 'POST',
          url: `${global.__URLPREFIX__}/technology-description`,
          headers: { cookie: 'crumb=' + crumbToken },
          payload: {
              itemName: 'some item name',
              brand: 'some brand',
              model: 'some model',
              numberOfItems: '15',
              projectItemsList: ['Harvesting technology', "Weeding technology"],
              crumb: crumbToken
          }
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
      const page = new JSDOM(response.payload).window.document
      const backLink = page.querySelector('.govuk-back-link')
      expect(backLink.getAttribute('href')).toBe('automatic-eligibility')
      expect(backLink.textContent).toBe('Back')
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
    const page = new JSDOM(response.payload).window.document
    const backLink = page.querySelector('.govuk-back-link')
    expect(backLink.getAttribute('href')).toBe('robotic-eligibility')
    expect(backLink.textContent).toBe('Back')
  })
})
