const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('../helpers/session')
const { ALL_QUESTIONS } = require('../config/question-bank')
const { getQuestionAnswer } = require('../helpers/utils')
const getUrl = (urlObject, url, request, secBtn) => {
  const scorePath = `${urlPrefix}/score`
  const chekDetailsPath = `${urlPrefix}/check-details`
  const secBtnPath = secBtn === 'Back to score' ? scorePath : chekDetailsPath
  const isRobotics = getQuestionAnswer('project-subject', 'project-subject-A1')
  if (!urlObject || secBtn) {
    return secBtn ? secBtnPath : url
  }
  const { dependentQuestionYarKey, secondDependentQuestionYarKey, dependentAnswerKeysArray, seconddependentAnswerKeysArray, urlOptions } = urlObject // just make it work for now
  let { thenUrl, elseUrl } = urlOptions
  const dependentQuestionYarKeys = [dependentQuestionYarKey].flat()
  thenUrl = [thenUrl].flat()
  let selectThenUrl
  let thenUrlIndex = -1

  if (getYarValue(request, 'projectSubject') === isRobotics) {
    if (getYarValue(request, 'tenancy') === 'Yes' && elseUrl === 'project-responsibility') {
      elseUrl = 'robotics/project-items'
    }
  }

  dependentQuestionYarKeys.every((dependantYarKey, index) => {
    const selectedAnswer = getYarValue(request, dependantYarKey)
    if (selectedAnswer !== null) {
      selectThenUrl = ALL_QUESTIONS.find(question => (
        question.yarKey === dependantYarKey &&
        question.answers &&
        question.answers.some(answer => (
          !!selectedAnswer &&
          dependentAnswerKeysArray.includes(answer.key) &&
          (Array.isArray(selectedAnswer) ? selectedAnswer.includes(answer.value) : (selectedAnswer === answer.value))
        ))
      ))
      if (selectThenUrl) {
        thenUrlIndex = index
        return false
      }
    }
    return true
  })

  return thenUrlIndex > -1 ? thenUrl[thenUrlIndex] : elseUrl
}

module.exports = {
  getUrl
}
