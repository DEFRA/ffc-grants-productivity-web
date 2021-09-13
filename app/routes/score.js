const { senders, getDesirabilityAnswers } = require('../messaging')
const Wreck = require('@hapi/wreck')
const { ALL_QUESTIONS } = require('../config/question-bank')
const pollingConfig = require('../config/polling')
const { setYarValue, getYarValue } = require('../helpers/session')

const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'score'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/business-details`

function createModel (data, request) {
  const previousPath = `${urlPrefix}/${getYarValue(request, 'projectSubject') === 'Robotics and innovation' ? 'robotics/technology' : 'slurry/slurry-to-be-treated'}`

  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...data
  }
}

async function getResult (correlationId) {
  const url = `${pollingConfig.host}/desirability-score?correlationId=${correlationId}`
  console.log('polling Url: ', url)
  for (let i = 0; i < pollingConfig.retries; i++) {
    await new Promise(resolve => setTimeout(resolve, pollingConfig.interval))
    try {
      const response = await Wreck.get(url, { json: true })

      switch (response.res.statusCode) {
        case 202:
          console.log('202 received, backend didn\'t have result, continue polling')
          break
        case 200:
          console.log('200 received, got result from backend, stop polling')
          return response.payload
        default:
          console.log('Unhandled status code, stop polling')
          return null
      }
    } catch (err) {
      // 4xx and 5xx errors will be caught here along with failure to connect
      console.log(`${err}`)
      return null
    }
  }

  console.log(`Tried getting score ${pollingConfig.retries} times, giving up`)
  return null
}

module.exports = [{
  method: 'GET',
  path: currentPath,
  options: {
    log: {
      collect: true
    }
  },
  handler: async (request, h, err) => {
    try {
      console.log('Scoring...1')
      const msgDataToSend = getDesirabilityAnswers(request)
      if (!msgDataToSend) {
        throw new Error('no data available for score.')
      }
      console.log('Scoring...2')
      // Always re-calculate our score before rendering this page
      await senders.sendProjectDetails(msgDataToSend, request.yar.id)

      // Poll for backend for results from scoring algorithm
      // If msgData is null then 500 page will be triggered when trying to access object below
      const msgData = await getResult(request.yar.id)
      console.log('msgData', msgData)
      if (msgData) {
        const questions = msgData.desirability.questions.map(desirabilityQuestion => {
          const bankQuestion = ALL_QUESTIONS.filter(bankQuestionD => bankQuestionD.key === desirabilityQuestion.key)[0]
          console.log(bankQuestion, 'bankQuestion')
          desirabilityQuestion.title = bankQuestion.title
          desirabilityQuestion.desc = bankQuestion.desc ?? ''
          desirabilityQuestion.url = `${urlPrefix}/${bankQuestion.url}`
          desirabilityQuestion.order = bankQuestion.order
          desirabilityQuestion.unit = bankQuestion?.unit
          desirabilityQuestion.pageTitle = bankQuestion.pageTitle
          desirabilityQuestion.fundingPriorities = bankQuestion.fundingPriorities
          return desirabilityQuestion
        })
        console.log('questions', questions)
        let scoreChance
        switch (msgData.desirability.overallRating.band.toLowerCase()) {
          case 'strong':
            scoreChance = 'seems likely to'
            break
          case 'average':
            scoreChance = 'might'
            break
          default:
            scoreChance = 'seems unlikely to'
            break
        }
        setYarValue(request, 'current-score', msgData.desirability.overallRating.band)
        return h.view(viewTemplate, createModel({
          titleText: msgData.desirability.overallRating.band,
          scoreData: msgData,
          questions: questions.sort((a, b) => a.order - b.order),
          scoreChance: scoreChance
        }, request))
      } else {
        throw new Error('Score not received.')
      }
    } catch (error) {
      request.log(error)
    }
    request.log(err)
    return h.view('500')
  }
},
{
  method: 'POST',
  path: currentPath,
  handler: (request, h) => {
    request.yar.set('score-calculated', true)
    return h.redirect(nextPath)
  }
}]
