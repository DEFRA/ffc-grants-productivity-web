const { getUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue } = require('../helpers/session')
const { getQuestionByKey } = require('../helpers/utils')

const getDependentSideBar = (sidebar, request) => {
  // sidebar contains values of a previous page

  const { values, dependentYarKey, dependentQuestionKey } = sidebar

  const questionAnswers = getQuestionByKey(dependentQuestionKey).answers
  const yarValue = getYarValue(request, dependentYarKey) || []

  const updatedValues = []
  let addUpdatedValue

  values.forEach((thisValue) => {
    addUpdatedValue = false
    const updatedContent = thisValue.content.map(thisContent => {
      let formattedSidebarValues = []

      if (thisContent?.dependentAnswerExceptThese?.length) {
        const avoidThese = thisContent.dependentAnswerExceptThese

        questionAnswers.forEach(({ key, value }) => {
          if (!avoidThese.includes(key) && yarValue?.includes(value)) {
            addUpdatedValue = true
            formattedSidebarValues.push(value)
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
  let { type, backUrl, key, backUrlObject, sidebar, title, score, label } = question
  const hasScore = !!getYarValue(request, 'current-score')
  title = title ?? label?.text

  const sideBarText = (sidebar?.dependentYarKey)
    ? getDependentSideBar(sidebar, request)
    : sidebar

  return {
    type,
    key,
    title,
    backUrl: getBackUrl(hasScore, backUrlObject, backUrl, request),
    items: getOptions(data, question, conditionalHtml, request),
    sideBarText,
    diaplaySecondryBtn: hasScore && score?.isDisplay
  }
}

module.exports = {
  getModel
}
