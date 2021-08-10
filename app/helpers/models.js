const { getBackUrl } = require('../helpers/urls')
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

const getModel = (data, question, request, conditionalHtml = '') => {
  const { type, backUrl } = question
  const model = {
    type,
    backUrl: getBackUrl(question.backUrlObject, backUrl, request),
    items: getOptions(data, question, conditionalHtml),
    sideBarText: question.sidebar
  }
  return (question.sidebar?.dependentYarKey) ? getDependentSideBarModel(question, model, request) : model
}

module.exports = {
  getModel
}
