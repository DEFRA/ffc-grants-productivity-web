const { getUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue } = require('../helpers/session')
const { getQuestionByKey, allAnswersSelected } = require('../helpers/utils')

const getDependentSideBar = (sidebar, request) => {
  // sidebar contains values of a previous page

  const { values, dependentYarKeys, dependentQuestionKeys } = sidebar
  // for each dependentQuestionKeys
  const updatedValues = []
  let addUpdatedValue
  let updatedContent
  dependentQuestionKeys.forEach((dependentQuestionKey, index) => {
    const questionAnswers = getQuestionByKey(dependentQuestionKey).answers
    const yarValue = getYarValue(request, dependentYarKeys[index]) || []

    values.forEach((thisValue) => {
      addUpdatedValue = false
      updatedContent = thisValue.content.map(thisContent => {
        let formattedSidebarValues = []

        if (thisContent?.dependentAnswerExceptThese?.length) {
          const avoidThese = thisContent.dependentAnswerExceptThese

          questionAnswers.forEach(({ key, value }) => {
            if (!avoidThese.includes(key) && yarValue?.includes(value)) {
              if (updatedValues.length && updatedValues[0].heading === thisValue.heading) {
                updatedValues[0].content[0].items.push(value)
              } else {
                addUpdatedValue = true
                formattedSidebarValues.push(value)
              }
            }
          })
        } else if (thisContent?.dependentAnswerOnlyThese?.length) {
          const addThese = thisContent.dependentAnswerOnlyThese

          questionAnswers.forEach(({ key, value }) => {
            if (addThese.includes(key) && yarValue?.includes(value)) {
              addUpdatedValue = true
              formattedSidebarValues.push(value)
            }
          })
        } else {
          formattedSidebarValues = [].concat(yarValue)
        }
        return {
          ...thisContent,
          items: formattedSidebarValues
        }
      })
      if (addUpdatedValue) {
        updatedValues.push({
          ...thisValue,
          content: updatedContent
        })
      }
    })
  })

  return {
    ...sidebar,
    values: updatedValues
  }
}

const getBackUrl = (hasScore, backUrlObject, backUrl, request) => {
  const url = getUrl(backUrlObject, backUrl, request)
  return hasScore && (url === 'project-impact' || url === 'SSSI') ? null : url
}

const getModel = (data, question, request, conditionalHtml = '') => {
  const { type, backUrl, key, backUrlObject, sidebar, score, label, warning, warningConditional, hint, nextUrl, dependantNextUrl } = question
  const hasScore = !!getYarValue(request, 'current-score')
  const title = question.title ?? label?.text

  const sideBarText = (sidebar?.dependentYarKeys)
    ? getDependentSideBar(sidebar, request)
    : sidebar

  let warningDetails
  if (warningConditional) {
    const { dependentWarningQuestionKey, dependentWarningAnswerKeysArray, ConditionalWarningMsg } = warningConditional
    if (allAnswersSelected(request, dependentWarningQuestionKey, dependentWarningAnswerKeysArray)) {
      warningDetails = ConditionalWarningMsg
    }
  } else if (warning) {
    warningDetails = warning
  }

  return {
    type,
    hint,
    key,
    title,
    backUrl: getBackUrl(hasScore, backUrlObject, backUrl, request),
    nextUrl: getUrl(dependantNextUrl, nextUrl, request),
    items: getOptions(data, question, conditionalHtml, request),
    sideBarText,
    ...(warningDetails ? ({ warning: warningDetails }) : {}),
    diaplaySecondryBtn: hasScore && score?.isDisplay
  }
}

module.exports = {
  getModel
}
