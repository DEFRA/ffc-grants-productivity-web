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
  const { thenUrl, elseUrl } = urlOptions

  const dependentAnswer = getYarValue(request, dependentQuestionYarKey)
  console.log(dependentAnswer, 'dependentAnswer')
  const selectThenUrl = ALL_QUESTIONS.find(thisQuestion => (
    thisQuestion.yarKey === dependentQuestionYarKey &&
    thisQuestion.answers &&
    thisQuestion.answers.some(answer => (
      !!dependentAnswer &&
      dependentAnswerKeysArray.includes(answer.key) &&
      (Array.isArray(dependentAnswer) ? dependentAnswer.includes(answer.value) : dependentAnswer === answer.value)
    ))
  ))
      console.log(selectThenUrl ,thenUrl, elseUrl, 'URLS', request.url)
  return selectThenUrl ? thenUrl : elseUrl
}

module.exports = {
  getUrl
}
