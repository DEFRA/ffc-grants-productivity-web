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
  console.log('dependentQuestionYarKeys: ', dependentQuestionYarKeys);
  thenUrl = [thenUrl].flat()
  let selectThenUrl
  let thenUrlIndex = -1


  dependentQuestionYarKeys.every((dependantYarKey, index) => {
    const selectedAnswer = getYarValue(request, dependantYarKey)
    console.log('selectedAnswer: ', selectedAnswer);
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
      console.log('selectThenUrl: ', selectThenUrl);
      if (selectThenUrl) {
        thenUrlIndex = index
        console.log('selectThenUrl: ', selectThenUrl, '- thenUrlIndex: ', thenUrlIndex);
        return false
      }
    }
    return true
  })
  console.log('thenUrlIndex: ', thenUrlIndex);
  console.log('thenUrl: ', thenUrl);
  const resultURL = thenUrlIndex > -1 ? thenUrl[thenUrlIndex] : elseUrl
  console.log('resultURL: ', resultURL);
  return resultURL
}

module.exports = {
  getUrl
}