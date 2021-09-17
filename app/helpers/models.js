const { getUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue } = require('../helpers/session')

const getDependentSideBarModel = (question, model, request) => {
  // sidebar contains values of a previous page
  const rawSidebarValues = getYarValue(request, question.sidebar.dependentYarKey) || []
  const formattedSidebarValues = [].concat(rawSidebarValues)
  const valuesCount = formattedSidebarValues.length
  model = {
    ...model,
    sideBarText: {
      heading: (valuesCount < 2) ? '1 item selected' : `${valuesCount} items selected`,
      para: '',
      items: formattedSidebarValues
    }
  }
  return model
}

const getBackUrl = (hasScore, backUrlObject, backUrl,request) => {

  const url = getUrl(backUrlObject, backUrl, request)
  return hasScore && url === 'project-impact' || url === 'SSSI' ? null : url
}

const getModel = (data, question, request, conditionalHtml = '') => {
  const { type, backUrl, key, backUrlObject, sidebar, title, score } = question
  const hasScore = !!getYarValue(request, 'current-score')
  const model = {
    type,
    key,
    title,
    backUrl: getBackUrl(hasScore, backUrlObject, backUrl, request) ,
    items: getOptions(data, question, conditionalHtml, request),
    sideBarText: sidebar,
    diaplaySecondryBtn: hasScore && score?.isDisplay
  }
  return (sidebar?.dependentYarKey) ? getDependentSideBarModel(question, model, request) : model
}

module.exports = {
  getModel
}
