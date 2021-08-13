const { getYarValue } = require('../helpers/session')
const { ALL_QUESTIONS } = require('../config/question-bank')

const getUrl = (urlObject, url, request) => {
  if (!urlObject) {
    return url
  }
  const { dependentQuestionYarKey, dependentAnswerKeysArray, backUrlOptions } = urlObject
  const { thenUrl, elseUrl } = backUrlOptions

  const dependentAnswer = getYarValue(request, dependentQuestionYarKey)

  const selectThenUrl = ALL_QUESTIONS.find(thisQuestion => (
    thisQuestion.yarKey === dependentQuestionYarKey &&
    thisQuestion.answers &&
    thisQuestion.answers.some(answer => (
      !!dependentAnswer &&
      dependentAnswerKeysArray.includes(answer.key) &&
      dependentAnswer.includes(answer.value)
    ))
  ))

  return selectThenUrl ? thenUrl : elseUrl
}

module.exports = {
  getUrl
}
