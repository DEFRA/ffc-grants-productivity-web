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

const getModel = (data, question, request, conditionalHtml = '') => {
  const { type, backUrl, key, backUrlObject, sidebar, title, score } = question
  const hasScore = !!getYarValue(request, 'current-score')
  console.log( (key === 'project-impacts' || key === 'robotics-data-analytics'), 'kkkkk= ', key, hasScore)
  const model = {
    type,
    key,
    title,
    backUrl: hasScore && (key === 'project-impacts' || key === 'data-analytics') ? undefined : getUrl(backUrlObject, backUrl, request) ,
    items: getOptions(data, question, conditionalHtml, request),
    sideBarText: sidebar,
    diaplaySecondryBtn: hasScore && score?.isDisplay
  }
  return (sidebar?.dependentYarKey) ? getDependentSideBarModel(question, model, request) : model
}

module.exports = {
  getModel
}
