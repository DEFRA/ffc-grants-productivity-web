const { getUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue } = require('../helpers/session')

const getDependentSideBarModel = (question, model, request) => {
  // sidebar contains values of a previous page
  const rawSidebarValues = getYarValue(request, question.sidebar.dependentYarKey) || []
  const formattedSidebarValues = [].concat(rawSidebarValues)
  model = {
    ...model,
    sideBarText: {
      heading: question.sidebar.heading,
      para: '',
      items: formattedSidebarValues
    }
  }
  return model
}

const getBackUrl = (hasScore, backUrlObject, backUrl, request) => {
  const url = getUrl(backUrlObject, backUrl, request)
  return hasScore && (url === 'project-impact' || url === 'SSSI') ? null : url
}

const getModel = (data, question, request, conditionalHtml = '') => {
  let { type, backUrl, key, backUrlObject, sidebar, title, score, label } = question
  const hasScore = !!getYarValue(request, 'current-score')
  title = title ?? label?.text

  const model = {
    type,
    key,
    title,
    backUrl: getBackUrl(hasScore, backUrlObject, backUrl, request),
    items: getOptions(data, question, conditionalHtml, request),
    sideBarText: sidebar,
    diaplaySecondryBtn: hasScore && score?.isDisplay
  }
  return (sidebar?.dependentYarKey) ? getDependentSideBarModel(question, model, request) : model
}

module.exports = {
  getModel
}
