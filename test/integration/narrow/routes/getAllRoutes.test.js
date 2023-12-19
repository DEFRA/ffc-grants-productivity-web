const { validate } = require('uuid')
const { ALL_QUESTIONS } = require('../../../../app/config/question-bank')

const senders = require('../../../../app/messaging/senders')

const varListTemplate = {
  planningPermission: 'Should be in place by the time I make my full application',
  planningPermissionEvidence: {
    planningAuthority: 'some planning',
    planningReferenceNumber: '123456-ref'
  },
  projectSubject: 'Farm productivity project items',
  applicant: 'Contractor',
  businessLocation: 'Yes',
  inEngland: 'Yes',
  tenancy: 'No',
  projectStart: 'Random data',
  projectResponsibility: 'Yes, I plan to take full responsibility for my project',
  existingSolar: 'Yes',
  farmersDetails: 'voila',
  consentMain: 'lalal',
  technologyItems: 'Solar PV panels',
  projectItems: 'Advanced ventilation control units',
  energySource: 'Fossil fuels',
  dataAnalytics: 'Yes, we have the technology already',
  solarTechnologies: 'Solar PV panels',
  solarInstallation: 'randomData',
  legalStatus: 'Trust',
  projectImpact: 'Yes',
  businessDetails: {
    projectName: 'randomData',
  },
  projectItemsList: [
    {
      realItem: 'hello',
      item: 'hello',
      type: 'Automatic',
      description: {
          itemName: '',
          brand: '',
          model: '',
          numberOfItems: '',
      }
  },
  {
      realItem: 'hello',
      item: 'hello',
      type: 'Automatic',
      description: {
          itemName: '',
          brand: '',
          model: '',
          numberOfItems: '',
      },
      criteriaScoring: ['Has sensing system that can understand its environment', 'Makes decisions and plans', 'Can control its actuators (the devices that move robotic joints)', 'Works in a continuous loop']
  }
  ],
  confirmItem: 'Other technology',
  errorForRemove: 'the other automatic technology',
  index: 1,
  itemType: 'Automatic',
  removeItem: 'Yes',
  technologyDescription: {
    itemName: 'erer',
    brand: '',
    model: '',
    numberOfItems: '',
},
}

// confirm item added for remove-item

let varList
ALL_QUESTIONS.forEach(question => {
  if (question.preValidationKeys) {
    varList = question.preValidationKeys.map(m => {
      return { m: 'someValue' }
    })
  }
})
jest.doMock('../../../../app/helpers/session', () => ({
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (varList[key]) return varList[key]
    else return undefined
  }
}))

describe('All default GET routes', () => {

  beforeEach(() => {
    varList = { ...varListTemplate }
  })
  afterEach(() => {
    jest.clearAllMocks()
  })


  ALL_QUESTIONS.forEach(question => {
    it(`should load ${question.key} page successfully`, async () => {

      if (question.key === 'existing-solar') {
        varList.projectSubject = 'Solar project items'
      } else if (question.key === 'robotics-project-items') {
        varList.projectSubject = 'Farm productivity project items'
      }else if(question.key === 'agents-details'){
        varList.applicant = 'Farmer'
        varList.applying = 'Agent'
      }else if(question.key === 'robotic-automatic'){
        varList.technologyItems = 'Harvesting technology'
      }else if(question.key === 'farmer-details'){
        varList.applicant = 'Farmer'
      }else if(question.key === 'robotic-eligibility'){
        varList. roboticAutomatic = 'Robotic'
      }else if(question.key === 'automatic-eligibility'){
        varList.projectItems = 'Robotic and automatic technology'
        varList.roboticAutomatic = 'Automatic'
        varList.technologyItems = 'Harvesting technology'
      }else if(question.key === 'project-cost-solar'){
        varList.solarTechnologies = 'Solar PV panels'
        varList.solarOutput = 'Up to 50kW'
      }else if(question.key === 'technology-items'){
        varList.projectItems = 'Robotic and automatic technology'
      }else if(question.key === 'potential-amount-solar'){
        varList.projectSubject = 'Solar project items'
      }else if(question.key === 'remaining-costs-solar'){
        varList.projectSubject = 'Solar project items'
      }else if(question.key === 'project-items'){
        varList.applicant = 'Farmer'
        varList.tenancy = 'Yes'
      }

      const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/${question.url}`
      }

      jest.spyOn(senders, 'sendDesirabilitySubmitted').mockImplementationOnce(() => Promise.resolve(true))

      const response = await global.__SERVER__.inject(options)
      expect(response.statusCode).toBe(200)
    })
  })
})
