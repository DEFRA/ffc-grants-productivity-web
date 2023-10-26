const { ALL_QUESTIONS } = require('../../../../app/config/question-bank')

const senders = require('../../../../app/messaging/senders')

const varListTemplate = {
  planningPermission: 'Should be in place by the time I make my full application',
  planningPermissionEvidence: {
    planningAuthority: 'some planning',
    planningReferenceNumber: '123456-ref'
  },
  projectSubject: 'Robotics and automatic technology',
  applicant: 'Contractor',
  businessLocation: 'Yes',
  inEngland: 'Yes',
  tenancy: 'No',
  projectResponsibility: 'Yes, I plan to take full responsibility for my project',
  existingSolar: 'Yes',
  farmersDetails: 'voila',
  consentMain: 'lalal',
  technologyItems: 'Solar panels',
}

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
        varList.projectSubject = 'Solar technologies'
      } else if (question.key === 'robotics-project-items') {
        varList.projectSubject = 'Robotics and automatic technology'
    
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
