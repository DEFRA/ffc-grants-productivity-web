const { getUrl } = require('../helpers/urls')
const { getModelItems } = require('../helpers/answer-options')
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

const getModel = (data, question, request, conditionalHtml = '') => {
  const { type, backUrl, key, backUrlObject, sidebar } = question
  const model = {
    type,
    key,
    backUrl: getUrl(backUrlObject, backUrl, request),
    items: getModelItems(data, question, conditionalHtml),
    sideBarText: sidebar
  }
  return (sidebar?.dependentYarKey) ? getDependentSideBarModel(question, model, request) : model
}

module.exports = {
  getModel
}
