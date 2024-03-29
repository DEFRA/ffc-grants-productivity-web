const urlPrefix = require('../config/server').urlPrefix
const { getYarValue, setYarValue } = require('../helpers/session')
const { ALL_QUESTIONS } = require('../config/question-bank')

const getUrl = (urlObject, url, request, secBtn) => {
  const scorePath = `${urlPrefix}/score`
  const chekDetailsPath = `${urlPrefix}/check-details`
  let secBtnPath = secBtn === 'Back to score' ? scorePath : chekDetailsPath

  if(secBtn ==='Add another technology'){    // reset if "Add another technology" selected
    setYarValue(request, 'technologyItems', null)
    setYarValue(request, 'roboticAutomatic', null)
    setYarValue(request, 'roboticEligibility', null)
    setYarValue(request, 'automaticEligibility', null)
    setYarValue(request, 'technologyDescription', null)
    setYarValue(request, 'addToItemList', true)
    
    secBtnPath = `${urlPrefix}/technology-items`
  }
  
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