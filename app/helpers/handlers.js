const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const { SELECT_ADDITIONAL_YAR_KEY } = require('../helpers/regex')

const getPage = (question, request, h) => {
  if (question.maybeEligible) {
    const { url, backUrl, nextUrl } = question
    let { maybeEligibleContent } = question

    maybeEligibleContent = {
      ...maybeEligibleContent,
      messageContent: maybeEligibleContent.messageContent.replace(
        SELECT_ADDITIONAL_YAR_KEY, (_ignore, additionalYarKeyName) => (
          formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
        )
      )
    }

    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, url, nextUrl, backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  if (question.title) {
    question = {
      ...question,
      title: question.title.replace(SELECT_ADDITIONAL_YAR_KEY, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
  }

  const data = getYarValue(request, question.yarKey) || null
  return h.view('page', getModel(data, question, request))
}

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload
  let thisAnswer

  for (const [key, value] of Object.entries(payload)) {
    thisAnswer = answers.find(answer => (answer.value === value))
    setYarValue(request, key, value)
  }
  // either [ineligible] or [redirection]
  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    return errors
  } else if (thisAnswer?.notEligible || (yarKey === 'projectCost' ? !getGrantValues(payload[Object.keys(payload)[0]], currentQuestion?.grantInfo).isEligible : null)) {
    return h.view('not-eligible', NOT_ELIGIBLE)
  } else if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl)
  }

  // extra actions for specific pages
  if (yarKey === 'projectCost') {
    const { calculatedGrant, remainingCost } = getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo)

    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
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
