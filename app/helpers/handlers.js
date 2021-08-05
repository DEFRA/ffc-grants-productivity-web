const { getYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')

const getPage = (question, request, h) => {
  if (question.maybeEligible) {
    const { url, backUrl, nextUrl } = question

    let { maybeEligibleContent } = question

    maybeEligibleContent = {
      ...maybeEligibleContent,
      messageContent: maybeEligibleContent.messageContent.replace(
        /{{_(.+?)_}}/ig, (_, yarKeyTitleDependency) => (
          (getYarValue(request, yarKeyTitleDependency) || 0)
        )
      )
    }

    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, url, nextUrl, backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  if (question.title) {
    question.title = question.title.replace(/{{_(.+?)_}}/ig, (_, yarKeyTitleDependency) => (
      (getYarValue(request, yarKeyTitleDependency) || 0)
    ))
  }

  const data = getYarValue(request, question.yarKey) || null
  return h.view('page', getModel(data, question, request))
}

const getHandler = (question) => {
  return (request, h) => {
    return getPage(question, request, h)
  }
}

module.exports = {
  getHandler
}
