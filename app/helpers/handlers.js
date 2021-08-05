const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')

const getPage = (question, request, h) => {
  if (question.maybeEligible) {
    const { url, backUrl, nextUrl, maybeEligibleContent } = question
    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, url, nextUrl, backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  const data = getYarValue(request, question.yarKey) || null
  return h.view('page', getModel(data, question, request))
}

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload
  const value = payload[Object.keys(payload)[0]]
  const thisAnswer = answers.find(answer => (answer.value === value))

  setYarValue(request, yarKey, value)

  // either [ineligible] or [redirection]
  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    return errors
  } else if (thisAnswer?.notEligible || (yarKey === 'projectCost' ? !getGrantValues(value, currentQuestion?.grantInfo).isEligible : null)) {
    return h.view('not-eligible', NOT_ELIGIBLE)
  } else if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl)
  }

  return h.redirect(nextUrl)
}

const getHandler = (question) => {
  return (request, h) => {
    return getPage(question, request, h)
  }
}

const getPostHandler = (currentQuestion) => {
  return (request, h) => {
    return showPostPage(currentQuestion, request, h)
  }
}

module.exports = {
  getHandler,
  getPostHandler
}
