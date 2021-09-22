const { ALL_QUESTIONS } = require('../../../../app/config/question-bank')

describe('All default GET routes', () => {
  let varList
  ALL_QUESTIONS.forEach(question => {
    if (question.preValidationKeys) {
      varList = question.preValidationKeys.map(m => {
        return { m: 'someValue' }
      })

      jest.mock('../../../../app/helpers/session', () => ({
        setYarValue: (request, key, value) => null,
        getYarValue: (request, key) => {
          console.log(key, 'key')
          if (typeof varList === 'undefined') {
            if (varList[key]) return varList[key]
            else return 'Error'
          }
          return null
        }
      }))
    }
    it(`should load ${question.key} page successfully`, async () => {
      const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/${question.url}`
      }
      const response = await global.__SERVER__.inject(options)
      if (question.url === 'confirmation') {
        expect(response.statusCode).toBe(302)
      } else {
        expect(response.statusCode).toBe(200)
      }
    })
  })
})
