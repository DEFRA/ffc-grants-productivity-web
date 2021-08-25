const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const { SELECT_VARIABLE_TO_REPLACE, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex')
const { getHtml } = require('../helpers/conditionalHTML')
const { getUrl } = require('../helpers/urls')
const { setOptionsLabel } = require('../helpers/answer-options')

const getConfirmationId = (guid, journey) => {
  const prefix = journey === 'Slurry acidification' ? 'SL' : 'RI'
  return `${prefix}-${guid.substr(0, 3)}-${guid.substr(3, 3)}`.toUpperCase()
}

const handleConditinalHtmlData = (type, yarKey, request) => {
  const isMultiInput = type === 'multi-input'
  const label = isMultiInput ? 'sbi' : yarKey
  const fieldValue = isMultiInput ? getYarValue(request, yarKey).sbi : getYarValue(request, yarKey)
  return getHtml(label, fieldValue)
}

const getPage = (question, request, h) => {
  const { url, backUrl, dependantNextUrl, type, title, yarKey } = question
  const nextUrl = getUrl(dependantNextUrl, question.nextUrl, request)

  if (question.maybeEligible) {
    let { maybeEligibleContent } = question
    let consentOptionalData

    if (maybeEligibleContent.reference) {
      if (!getYarValue(request, 'consentMain')) {
        return h.redirect('/productivity/start')
      }
      maybeEligibleContent = {
        ...maybeEligibleContent,
        reference: {
          ...maybeEligibleContent.reference,
          html: maybeEligibleContent.reference.html.replace(
            SELECT_VARIABLE_TO_REPLACE, (_ignore, confirmationId) => (
              getConfirmationId(request.yar.id, getYarValue(request, 'projectSubject'))
            )
          )
        }
      }
      request.yar.reset()
    }

    maybeEligibleContent = {
      ...maybeEligibleContent,
      messageContent: maybeEligibleContent.messageContent.replace(
        SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
          formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
        )
      )
    }

    if (url === 'confirm') {
      const consentOptional = getYarValue(request, 'consentOptional')
      consentOptionalData = {
        hiddenInput: {
          id: 'consentMain',
          name: 'consentMain',
          value: 'true',
          type: 'hidden'
        },
        idPrefix: 'consentOptional',
        name: 'consentOptional',
        items: setOptionsLabel(consentOptional,
          [{
            value: 'CONSENT_OPTIONAL',
            text: '(Optional) So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third-party working for us, to contact you.'
          }]
        )
      }
    }

    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, consentOptionalData, url, nextUrl, backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  if (title) {
    question = {
      ...question,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
  }

  const data = getYarValue(request, yarKey) || null
  let conditionalHtml
  if (yarKey === 'inEngland' || yarKey === 'businessDetails') {
    const conditional = yarKey === 'inEngland' ? question.conditionalKey : yarKey
    conditionalHtml = handleConditinalHtmlData(type, conditional, request)
  }
  return h.view('page', getModel(data, question, request, conditionalHtml))
}

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl, dependantNextUrl, title, type, allFields } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload
  let thisAnswer
  let dataObject
  if (yarKey === 'consentOptional' && !Object.keys(payload).includes(yarKey)) {
    setYarValue(request, yarKey, '')
  }

  for (let [key, value] of Object.entries(payload)) {
    thisAnswer = answers?.find(answer => (answer.value === value))

    if (key === 'projectPostcode') {
      value = value.replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase()
    }

    (type !== 'multi-input') && setYarValue(request, key, value)
  }

  if (type === 'multi-input') {
    allFields.forEach(field => {
      dataObject = {
        ...dataObject,
        [field.yarKey]: payload[field.yarKey] || '',
        ...field.conditionalKey ? { [field.conditionalKey]: payload[field.conditionalKey] } : {}
      }
    })
    setYarValue(request, yarKey, dataObject)
  }

  if (title) {
    currentQuestion = {
      ...currentQuestion,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
  }

  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    return errors
  }

  if (thisAnswer?.notEligible || (yarKey === 'projectCost' ? !getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo).isEligible : null)) {
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
