const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const { SELECT_ADDITIONAL_YAR_KEY, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex')
const { getHtml } = require('../helpers/conditionalHTML')
const { getUrl } = require('../helpers/urls')

const getPage = (question, request, h) => {
  if (question.maybeEligible) {
    const { url, backUrl, dependantNextUrl } = question
    const nextUrl = getUrl(dependantNextUrl, question.nextUrl, request)
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
  let conditionalHtml
  if (question.yarKey === 'inEngland') {
    conditionalHtml = getHtml(getYarValue(request, 'projectPostcode'))
  }
  return h.view('page', getModel(data, question, request, conditionalHtml))
}

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl, dependantNextUrl } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload
  let thisAnswer

  for (let [key, value] of Object.entries(payload)) {
    thisAnswer = answers.find(answer => (answer.value === value))

    if (key === 'projectPostcode') {
      value = value.replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase()
    }
    setYarValue(request, key, value)
  }

  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    return errors
  }

  if (thisAnswer?.notEligible || (yarKey === 'projectCost' ? !getGrantValues(payload[Object.keys(payload)[0]], currentQuestion?.grantInfo).isEligible : null)) {
    return h.view('not-eligible', NOT_ELIGIBLE)
  } else if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl)
  }

  if (yarKey === 'projectCost') {
    const { calculatedGrant, remainingCost } = getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo)

    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
  }

  return h.redirect(getUrl(dependantNextUrl, nextUrl, request))
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
