const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('../helpers/session')
const { ALL_QUESTIONS } = require('../config/question-bank')

const getUrl = (urlObject, url, request, secBtn) => {
  const scorePath = `${urlPrefix}/score`
  const chekDetailsPath = `${urlPrefix}/check-details`
  const secBtnPath = secBtn === 'Back to score' ? scorePath : chekDetailsPath

  if (!urlObject || secBtn) {
    return secBtn ? secBtnPath : url
  }
  const { dependentQuestionYarKey, dependentAnswerKeysArray, urlOptions } = urlObject
  let { thenUrl, elseUrl } = urlOptions

  const dependentQuestionYarKeys = [dependentQuestionYarKey].flat()
  thenUrl = [thenUrl].flat()
  let selectThenUrl
  let thenUrlIndex = -1

  dependentQuestionYarKeys.every((dependantYarKey, index) => {
    const selectedAnswer = getYarValue(request, dependantYarKey)
    if (selectedAnswer) {
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
  const resultURL = thenUrlIndex > -1 ? thenUrl[thenUrlIndex] : elseUrl
  return resultURL
}

module.exports = {
  getUrl
}