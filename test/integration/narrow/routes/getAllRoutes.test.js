const { ALL_QUESTIONS } = require('../../../../app/config/question-bank')

const senders = require('../../../../app/messaging/senders')

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
  varList.planningPermission = 'Not yet applied'
  varList.PlanningPermissionEvidence = {
    planningAuthority: 'some planning',
    planningReferenceNumber: '123456-ref'
  }
  varList.consentMain = 'random'
  varList.farmersDetails = 'values'
  varList.projectSubject = '12345'

  ALL_QUESTIONS.forEach(question => {
    it(`should load ${question.key} page successfully`, async () => {
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
