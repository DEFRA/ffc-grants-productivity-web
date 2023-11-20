const { getUrl } = require('../helpers/urls')
const { getOptions } = require('../helpers/answer-options')
const { getYarValue } = require('../helpers/session')
const { getQuestionByKey, allAnswersSelected, getQuestionAnswer } = require('../helpers/utils')

const getDependentSideBar = (sidebar, request) => {
  // sidebar contains values of a previous page

  let sidebarEligibleItems = []
  if (getYarValue(request, 'projectItems').includes(getQuestionAnswer('project-items', 'project-items-A1'))) {
    sidebarEligibleItems.push(getQuestionAnswer('project-items', 'project-items-A1'))
  } 

  if (getYarValue(request, 'projectItems').includes(getQuestionAnswer('project-items', 'project-items-A2'))) {
    sidebarEligibleItems.push(getQuestionAnswer('project-items', 'project-items-A2'))
  }

  if (getYarValue(request, 'projectItems').includes(getQuestionAnswer('project-items', 'project-items-A3'))) {
    let itemsList = getYarValue(request, 'projectItemsList')
    for (item in itemsList) {
      if (itemsList[item].item === getQuestionAnswer('technology-items', 'technology-items-A6')) {
        sidebarEligibleItems.push('Robotic voluntary milking system')
      } else if (itemsList[item].item.startsWith('Other')) {
        if (itemsList[item].type === 'Robotic') {
          sidebarEligibleItems.push('Other robotic technology')
        } else {
          sidebarEligibleItems.push('Other automatic technology')

        }
      } else {
        sidebarEligibleItems.push(itemsList[item].type + ' ' + itemsList[item].item.toLowerCase())
      }
    }
  }

  if (sidebarEligibleItems.length > 0) {
    sidebar.values[0].content[0].items = sidebarEligibleItems
    sidebar.values[0].show = true
  } else {
    sidebar.values[0].show = false

  }

  return {
    ...sidebar
  }

} 



const getBackUrl = (hasScore, backUrlObject, backUrl, request) => {
  const url = getUrl(backUrlObject, backUrl, request)
  return hasScore && (url === 'project-impact' || url === 'SSSI' || url === 'existing-solar') ? '' : url
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
    diaplaySecondryBtn: hasScore && score?.isDisplay && (key !== 'solar-technologies' && key !== 'energy-source'),
    showButton: question?.showButton
  }
}

module.exports = {
  getModel
}
