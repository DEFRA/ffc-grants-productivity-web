const { ALL_QUESTIONS } = require('../../../../app/config/question-bank')

describe('All default GET routes', () => {
  ALL_QUESTIONS.forEach(question => {
    it(`should load ${question.key} page successfully`, async () => {
      const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/${question.url}`
      }
      const response = await global.__SERVER__.inject(options)
      if (question.url === 'reference-number') {
        expect(response.statusCode).toBe(302)
      } else {
        expect(response.statusCode).toBe(200)
      }
    })
  })
})
