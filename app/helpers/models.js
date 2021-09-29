const { getUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue } = require('../helpers/session')

const getDependentSideBar = (question, sidebar, request) => {
  // sidebar contains values of a previous page

  const { dependentYarKey, content } = sidebar

  let rawSidebarValues
  let formattedSidebarValues

  const updatedSidebarContent = content.map(thisContent => {
    rawSidebarValues = getYarValue(request, dependentYarKey) || []
    formattedSidebarValues = [].concat(rawSidebarValues)

    return {
      ...thisContent,
      items: formattedSidebarValues
    }
  })

  return updatedSidebarContent
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
    ? getDependentSideBar(question, sidebar, request)
    : sidebar

  const model = {
    type,
    key,
    title,
    backUrl: getBackUrl(hasScore, backUrlObject, backUrl, request),
    items: getOptions(data, question, conditionalHtml, request),
    sideBarText,
    diaplaySecondryBtn: hasScore && score?.isDisplay
  }
  return model
}

module.exports = {
  getModel
}
