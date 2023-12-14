// const data = require('../../../../app/helpers/desirability-score.json')
// const scoreData = require('../../../data/score-data')
const { ALL_QUESTIONS } = require('../../../../app/config/question-bank')
const varList = {
  planningPermission: 'some fake value',
  gridReference: 'grid-ref-num',
  businessDetails: 'fake business',
  applying: true
}
const mockSet = jest.fn().mockImplementation((request, key, value) => varList[key] = value)
jest.mock('../../../../app/helpers/session', () => ({
  setYarValue: mockSet,
  getYarValue: (request, key) => {
    if (varList[key]) return varList[key]
    else return null
  }
}))

jest.mock('../../../../app/helpers/page-guard', () => ({
  guardPage: (a, b, c) => false
}))

jest.mock('../../../../app/helpers/urls', () => ({
  getUrl: (a, b, c, d) => 'mock-url'
}))
const mockSendGAEvent = jest.fn().mockImplementation((request, metrics) => {
  console.log('mockSendGAEvent called')
})
jest.mock('../../../../app/services/gapi-service', () => ({
  ...jest.requireActual('../../../../app/services/gapi-service'),
  sendGAEvent: mockSendGAEvent,
}))

describe('Get & Post Handlers', () => {
  const newSender = require('../../../../app/messaging/application')
  // const createMsg = require('../../../../app/messaging/create-msg')
  // const getUserScoreSpy = jest.spyOn(newSender, 'getUserScore').mockImplementation(() => {
  //   Promise.resolve(scoreData);
  // })
  // const getDesirabilityAnswersSpy = jest.spyOn(createMsg, 'getDesirabilityAnswers').mockImplementation(() => {
  //   return {
  //     test: 'test'
  //   };
  // })

  beforeEach(async () => {
    jest.mock('../../../../app/messaging')
    jest.mock('../../../../app/messaging/senders')
    jest.mock('ffc-messaging')
  })
  afterEach(async () => {
    jest.clearAllMocks()
  })

  let question
  let mockH
  let mockRequest

  const { getHandler, getPostHandler, createModel } = require('../../../../app/helpers/handlers')

  // plannign permission summary not in code yet
  xtest('will redirect to start page if planning permission evidence is missing', async () => {
    question = {
      url: 'planning-permission-summary',
      title: 'mock-title'
    }
    mockH = { redirect: jest.fn() }

    await getHandler(question)({}, mockH)
    expect(mockH.redirect).toHaveBeenCalledWith('/productivity/start')
  })

  // test('is eligible if calculated grant = min grant - whether grant is capped or not', async () => { // TODO: I don't understand this test is trying to check for
  //   question = {
  //     url: 'mock-url',
  //     title: 'mock-title',
  //     maybeEligible: true,
  //     maybeEligibleContent: { reference: 'mock-reference' }
  //   }
  //   mockH = { redirect: jest.fn() }

  //   await getHandler(question)({}, mockH)
  //   expect(mockH.redirect).toHaveBeenCalledWith('/productivity/start')
  // })

  // score not contained in handler.js, tests commented out
  xdescribe('it handles the score results page: ', () => {
    test('Average score', async () => {
      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link'
      }
      mockH = { view: jest.fn() }
      mockRequest = { yar: { id: 2 } }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        console.log('Spy: Average', JSON.stringify(scoreData))
        return scoreData
      })

      await getHandler(question)(mockRequest, mockH)
      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreData.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'might',
        scoreData: scoreData,
        questions: scoreData.desirability.questions
      })
      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
		  expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })

    test('Strong score', async () => {
      scoreData.desirability.overallRating.band = 'Strong'
      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link'
      }
      mockH = { view: jest.fn() }
      mockRequest = { yar: { id: 2 } }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        console.log('Spy: stroong', JSON.stringify(scoreData))
        return scoreData
      })

      await getHandler(question)(mockRequest, mockH)
      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreData.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'is likely to',
        scoreData: scoreData,
        questions: scoreData.desirability.questions
      })

      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
		  expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })

    test('Default score', async () => {
      scoreData.desirability.overallRating.band = 'AAAARRRGGHH!!!'
      question = {
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link'
      }
      mockH = { view: jest.fn() }
      mockRequest = { yar: { id: 2 } }

      jest.spyOn(newSender, 'getUserScore').mockImplementationOnce(() => {
        console.log('Spy: weakkk', JSON.stringify(scoreData))
        return scoreData
      })

      await getHandler(question)(mockRequest, mockH)
      expect(mockH.view).toHaveBeenCalledWith('score', {
        titleText: scoreData.desirability.overallRating.band,
        backLink: 'test-back-link',
        formActionPage: 'score',
        scoreChance: 'is unlikely to',
        scoreData: scoreData,
        questions: scoreData.desirability.questions
      })

      expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
		  expect(getUserScoreSpy).toHaveBeenCalledTimes(1)
    })
  })

  xdescribe('Create Model', () => {
    test('it creates a model!', () => {
      const res = createModel(data, 'test-back-link', 'score')
      expect(res).toEqual({
        ...data,
        formActionPage: 'score',
        backLink: 'test-back-link'
      })
    })
  })

  describe('getPostHandler', () => {
    it('should reset consentOptional yarkey', async () => {
      varList.consentOptional = true
      question = {
        yarKey: 'consentOptional',
        url: 'score',
        title: 'mock-title',
        backUrl: 'test-back-link',
        nextUrl: 'next-url'
      }
      mockH = {
        view: jest.fn(),
        redirect: jest.fn()
      }
      mockRequest = {
        yar: {
          id: 2,
          get: jest.fn(),
          set: jest.fn()
        },
        payload: {
        }
      }
      await getPostHandler(question)(mockRequest, mockH)
      expect(varList.consentOptional).toEqual('')
      expect(mockSet).toHaveBeenCalledWith(mockRequest, 'consentOptional', '')
    })
  })

  describe('GA events', () => { 
    varList.overAllScore = {
      desirability: {
        overallRating: {
          band: 'Strong'
        },
      }
    }
    mockH = {
      view: jest.fn(),
      redirect: jest.fn()
    }
    mockRequest = {
    }
    xit('sends a confirmation event when the user confirms their eligibility', async () => {
      const confirmQuestion = ALL_QUESTIONS.find(q => q.url === 'confirmation')
      await getHandler(confirmQuestion)(mockRequest, mockH)
      expect(mockSendGAEvent).toHaveBeenCalledWith(mockRequest, {
        name: "confirmation",
        params:  {
         action: "Confirmation page reached",
         final_score: "Strong",
         label: null,
       }
      })
    })
    
    xit('sends a scoring event when the user reaches the score page', async () => {
      varList.projectSubject = 'mock-project-subject'
      const scoreQuestion = {
        url: 'score',
        backUrl: 'test-back-link',
        answers: [],
      }
      scoreQuestion.maybeEligible = false
      await getHandler(scoreQuestion)(mockRequest, mockH)
      expect(mockSendGAEvent).toHaveBeenCalledWith(mockRequest, {
        name: "scoring",
        params:  {
         action: "Score results presented",
         score: "Strong",
         label: "mock-project-subject",
       }
      })
    })
   })
})

