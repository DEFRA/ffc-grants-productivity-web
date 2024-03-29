const { crumbToken } = require('./test-helper')

describe('Page: /robotic-eligibility', () => {
const varList = {
roboticEligibility: 'Yes',
technologyItems: 'Harvesting technology',
roboticAutomatic: 'Robotic',
projectItemsList: []
}

jest.mock('../../../../app/helpers/session', () => ({
setYarValue: (request, key, value) => null,
getYarValue: (request, key) => {
    if (varList[key]) return varList[key]
    else return undefined
}
}))

it('page loads successfully with all the options', async () => {
const options = {
    method: 'GET',
    url: `${global.__URLPREFIX__}/robotic-eligibility`
}

const response = await global.__SERVER__.inject(options)
expect(response.statusCode).toBe(200)
expect(response.payload).toContain('Does your robotic harvesting technology fit the eligibility criteria?')
expect(response.payload).toContain('Yes')
expect(response.payload).toContain('No')
})

it('no option selected -> show error message', async () => {
const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/robotic-eligibility`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { roboticEligibility: '', crumb: crumbToken }
}

const postResponse = await global.__SERVER__.inject(postOptions)
expect(postResponse.statusCode).toBe(200)
expect(postResponse.payload).toContain('Select yes if your robotic technology fits the eligibility criteria')
expect(postResponse.payload).toContain('Does your robotic harvesting technology fit the eligibility criteria?')
})

it('should redirect to /technology-description page when user response is \'Yes\'', async () => {
  varList.roboticEligibility = 'Yes'
  const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/robotic-eligibility`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { roboticEligibility: 'Yes', crumb: crumbToken }
  }

  const postResponse = await global.__SERVER__.inject(postOptions)
  expect(postResponse.headers.location).toBe('/productivity/technology-description')
}) 

it('should display ineligible page when user response is \'No\'', async () => {
varList.roboticEligibility = 'No'
const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/robotic-eligibility`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { roboticEligibility: 'No', crumb: crumbToken }
}

const postResponse = await global.__SERVER__.inject(postOptions)
expect(postResponse.payload).toContain('You cannot apply for grant funding for this technology')
expect(postResponse.payload).toContain('RPA will only fund robotic technology that:')
})

it('user selects \'Other robotics or automatic technology\' -> title should be \'Does your robotic technology fit the eligibility criteria?\'', async () => {
  varList.technologyItems = 'Other robotics or automatic technology'
  const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/robotic-eligibility`
  }

  const response = await global.__SERVER__.inject(options)
  expect(response.statusCode).toBe(200)
  expect(response.payload).toContain('Does your robotic technology fit the eligibility criteria?')
})

it('should display ineligible page with "Add another technology" and "Continue with eligible technology" buttons, if user selects No for the second project item', async () => {
  varList.projectItemsList = ['Harvesting technology', 'Other robotics or automatic technology']
  varList.roboticEligibility = 'No'
  const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/robotic-eligibility`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { roboticEligibility: 'No', crumb: crumbToken }
  }

  const postResponse = await global.__SERVER__.inject(postOptions)
  expect(postResponse.payload).toContain('You cannot apply for grant funding for this technology')
  expect(postResponse.payload).toContain('RPA will only fund robotic technology that:')
  expect(postResponse.payload).toContain('Add another technology')
  expect(postResponse.payload).toContain('Continue with eligible technology')
}) 

    const title_dict = {
      'Feeding robots': 'Do your feeding robots fit the eligibility criteria?',
      'Slurry robots': 'Do your slurry robots fit the eligibility criteria?',
      'Driverless robotic tractor or platform': 'Does your driverless robotic tractor or platform fit the eligibility criteria?',
      'Voluntary robotic milking system': 'Does your voluntary robotic milking system fit the eligibility criteria?',
    }
    Object.keys(title_dict).forEach(async (key) => {
      it(`If user selected "${key}", title should change to "${title_dict[key]}"`, async () => {
        varList.technologyItems = key
        const options = {
          method: 'GET',
          url: `${global.__URLPREFIX__}/robotic-eligibility`
        }
        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain(title_dict[key])
      })
    })

    const testBackLink = async (option, destination) => { 
      varList.technologyItems = option
      const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/robotic-eligibility`
      }
      
      const response = await global.__SERVER__.inject(options)
      expect(response.statusCode).toBe(200)
      expect(response.payload).toContain(`<a href=\"${destination}\" class=\"govuk-back-link\">Back</a>`)
    }
    
    it('page loads with correct back link if \"Driverless robotic tractor or platform option\" was chosen', async () => {
      await testBackLink('Driverless robotic tractor or platform', '/productivity/technology-items')
    })
  
    it('page loads with correct back link if  \"Voluntary robotic milking system\" was chosen', async () => {
      await testBackLink('Voluntary robotic milking system', '/productivity/technology-items')
    })
  
    it('page loads with correct back link if \"Slurry robots\" was chosen', async () => {
      await testBackLink('Slurry robots', '/productivity/technology-items')
    })
  
    it('page loads with correct back link if \"Robotic spraying technology\" was chosen', async () => {
      await testBackLink('Robotic spraying technology', '/productivity/technology-items')
    })
  
    it('page loads with correct back link if \"Feeding robots\" was chosen', async () => {
      await testBackLink('Feeding robots', '/productivity/technology-items')
    })  

    it('page loads with correct back link if \"Harvesting technology\" was chosen', async () => {
      await testBackLink('Harvesting technology', 'robotic-automatic')
    })
      
    it('page loads with correct back link if \"Transplanting technology\" was chosen', async () => {
      await testBackLink('Transplanting technology ', 'robotic-automatic')
    })
      
    it('page loads with correct back link if \"Weeding technology\" was chosen', async () => {
      await testBackLink('Weeding technology', 'robotic-automatic')
    })
      
    it('page loads with correct back link if \"Other robotics or automatic technology\" was chosen', async () => {
      await testBackLink('Other robotics or automatic technology', 'robotic-automatic')
    }) 
  })
  