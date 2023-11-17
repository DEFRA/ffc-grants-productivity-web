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
  country: 'Yes',
  tenancy: 'No',
  projectResponsibility: 'Yes, I plan to take full responsibility for my project',
  existingSolar: 'Yes',
  farmersDetails: 'voila',
  consentMain: 'lalal',
  technologyItems: 'Solar PV panels',
  projectItems: 'Advanced ventilation control units',
  projectItemsList: [
    {
        item: 'hello',
        type: 'aaaaaaaa',
        index: 0
    },
    {
        item: 'hello',
        type: 'sdjfhaf',
        index: 1
    }
  ],
  confirmItem: 'Other technology',
  errorForRemove: 'the other automatic technology',
  index: 1,
  itemType: 'Automatic',
  removeItem: 'Yes'
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
