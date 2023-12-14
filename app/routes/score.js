// const { senders, getDesirabilityAnswers } = require('../messaging')
const { getDesirabilityAnswers } = require('../messaging/create-msg')

const { ALL_QUESTIONS } = require('../config/question-bank')
const pollingConfig = require('../config/polling')
const { setYarValue, getYarValue } = require('../helpers/session')
const gapiService = require('../services/gapi-service')
const { getProdScoring } = require('../messaging/application')
const { getQuestionAnswer } = require('../helpers/utils')

const createMsg = require('./../messaging/scoring/create-desirability-msg')

const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'score'
const currentPath = `${urlPrefix}/${viewTemplate}`
const nextPath = `${urlPrefix}/business-details`

function createModel (data, request) {
  const projectItemsList = getYarValue(request, 'projectItemsList')
  const previousPathRobotics = (getYarValue(request, 'projectItems')?.includes(getQuestionAnswer('project-items', 'project-items-A3')) || projectItemsList?.length > 0) ? 'labour-replaced' : 'technology-use'
  const previousPath = `${urlPrefix}/${getYarValue(request, 'projectSubject') === getQuestionAnswer('project-subject', 'project-subject-A1') ? previousPathRobotics : 'agricultural-sector-solar'}`

  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...data
  }
}

// async function getResult (correlationId) {
//   const url = `${pollingConfig.host}/desirability-score?correlationId=${correlationId}`
//   console.log('polling Url: ', url)
//   for (let i = 0; i < pollingConfig.retries; i++) {
//     await new Promise(resolve => setTimeout(resolve, pollingConfig.interval))
//     try {
//       // const response = await Wreck.get(url, { json: true })

//       switch (response.res.statusCode) {
//         case 202:
//           console.log('202 received, backend didn\'t have result, continue polling')
//           break
//         case 200:
//           console.log('200 received, got result from backend, stop polling')
//           return response.payload
//         default:
//           console.log('Unhandled status code, stop polling')
//           return null
//       }
//     } catch (err) {
//       // 4xx and 5xx errors will be caught here along with failure to connect
//       console.log(`${err}`)
//       return null
//     }
//   }

//   console.log(`Tried getting score ${pollingConfig.retries} times, giving up`)
//   return null
// }

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
      const msgDataToSend = getDesirabilityAnswers(request)
      // if (!msgDataToSend) {
      //   throw new Error('no data available for score.')
      // }

      // Always re-calculate our score before rendering this page
      // ## For scoring ##
      const formatAnswersForScoring = createMsg(msgDataToSend)

      const msgData = await getProdScoring(formatAnswersForScoring, request.yar.id)

      console.log('Project details sent')
      // Poll for backend for results from scoring algorithm
      // If msgData is null then 500 page will be triggered when trying to access object below
      // const msgData = await getResult(request.yar.id)

      setYarValue(request, 'overAllScore', msgData)
      console.log('msgData', msgData)
      if (msgData) {
        let questions = msgData.desirability.questions.map(desirabilityQuestion => {
          const bankQuestion = ALL_QUESTIONS.filter(bankQuestionD => bankQuestionD.score && !!getYarValue(request, bankQuestionD.yarKey) === true && bankQuestionD.key === desirabilityQuestion.key)[0]
          if (bankQuestion) {
            desirabilityQuestion.title = bankQuestion.title
            desirabilityQuestion.desc = bankQuestion.desc ?? ''
            desirabilityQuestion.url = `${urlPrefix}/${bankQuestion.url}`
            desirabilityQuestion.order = bankQuestion.order
            desirabilityQuestion.unit = bankQuestion?.unit
            desirabilityQuestion.pageTitle = bankQuestion.pageTitle
            desirabilityQuestion.fundingPriorities = bankQuestion.fundingPriorities
            return desirabilityQuestion
          }
          return null
        })
        questions = questions.filter(a => a !== null)
        let scoreChance
        switch (msgData.desirability.overallRating.band.toLowerCase()) {
          case 'strong':
            scoreChance = 'is likely to'
            break
          case 'average':
            scoreChance = 'might'
            break
          default:
            scoreChance = 'is unlikely to'
            break
        }
        setYarValue(request, 'current-score', msgData.desirability.overallRating.band)
        // GA event: scoring
        await gapiService.sendGAEvent(request, {
          name: gapiService.eventTypes.SCORE,
          params: {
            score: msgData.desirability.overallRating.band,
            action: 'Score results presented',
          label: getYarValue(request, 'projectSubject') // Solar project items or Robotics project items
          }
        })

        setYarValue(request, 'onScorePage', true)

        return h.view(viewTemplate, createModel({
          titleText: msgData.desirability.overallRating.band,
          scoreData: msgData,
          questions: questions.sort((a, b) => a.order - b.order),
          scoreChance: scoreChance
        }, request))
      } else {
        // GA event: error
        await gapiService.sendGAEvent(request, {
          name: gapiService.eventTypes.EXCEPTION,
          params: {
            exceptionDescription: 'Score not received'
          }
        })
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
