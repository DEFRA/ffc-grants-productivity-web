const { getBackUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue } = require('../helpers/session')

const getModel = (data, question, request) => {
  const { type, backUrl } = question
  const model = {
    type,
    backUrl: getBackUrl(question.backUrlObject, backUrl, request),
    items: getOptions(data, question),
    sideBarText: question.sidebar
  }
  return getDependentSideBarModel(question, model, request)
}

const getDependentSideBarModel = (question, model, request) => {
  // sidebar contains values of a previous page
  if (question.sidebar && question.sidebar.dependentYarKey) {
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
  }
  return model
}

module.exports = {
  getModel
}
