
const urlPrefix = require('../config/server').urlPrefix
const { questionBank, ALL_QUESTIONS } = require('../config/question-bank')
const { setYarValue, getYarValue } = require('../helpers/session')
const { getGrantValues } = require('../helpers/grants-info')
const { radioButtons, checkBoxes, inputText } = require('../helpers/answer-types')

const getCorrectAnswerType = (data, question) => {
  switch (question.type) {
    case 'single-answer':
      return radioButtons(data, question)
    case 'multi-answer':
      return checkBoxes(data, question)
    case 'input':
      return inputText(data, question)
    default:
      return radioButtons(data, question)
  }
}

const resolveBackUrl = (backUrlObject, request) => {
  const { dependentQuestionYarKey, dependentAnswerKeysArray, backUrlOptions } = backUrlObject
  const { thenUrl, elseUrl } = backUrlOptions

  const dependentAnswer = getYarValue(request, dependentQuestionYarKey)

  const selectThenUrl = ALL_QUESTIONS.find(thisQuestion => (
    thisQuestion.yarKey === dependentQuestionYarKey &&
    thisQuestion.answers &&
    thisQuestion.answers.some(answer => (
      !!dependentAnswer &&
      dependentAnswerKeysArray.includes(answer.key) &&
      dependentAnswer.includes(answer.value)
    ))
  ))

  return selectThenUrl ? thenUrl : elseUrl
}

const getModel = (data, question, request) => {
  const { type, backUrl } = question

  const resolvedBackUrl = question.backUrlObject
    ? resolveBackUrl(question.backUrlObject, request)
    : backUrl

  const model = {
    type,
    backUrl: resolvedBackUrl,
    items: getCorrectAnswerType(data, question),
    sideBarText: question.sidebar
  }
  return model
}

const customiseErrorText = (value, currentQuestion, errorList, errorText, yarKey, h, request) => {
  const baseModel = getModel(value, currentQuestion, request)

  baseModel.items = { ...baseModel.items, errorMessage: { text: errorText } }
  errorList.push({
    text: errorText,
    href: `#${yarKey}`
  })

  const modelWithErrors = {
    ...baseModel,
    errorList
  }
  return h.view('page', modelWithErrors)
}

const showGetPage = (question, request, h) => {
  if (question.maybeEligible) {
    const { url, backUrl, nextUrl, maybeEligibleContent } = question
    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, url, nextUrl, backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  const data = getYarValue(request, question.yarKey) || null
  return h.view('page', getModel(data, question, request))
}

const getHandler = (question) => {
  return (request, h) => {
    return showGetPage(question, request, h)
  }
}

const drawSectionGetRequests = (section) => {
  return section.questions.map(question => {
    return {
      method: 'GET',
      path: `${urlPrefix}/${question.url}`,
      handler: getHandler(question)
    }
  })
}

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl, validate } = currentQuestion
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload
  const value = payload[Object.keys(payload)[0]]

  setYarValue(request, yarKey, value)

  // either [ineligible] or [redirection]
  const thisAnswer = answers.find(answer => (answer.value === value))

  if (thisAnswer) {
    if (thisAnswer.notEligible) {
      return h.view('not-eligible', NOT_ELIGIBLE)
    } else if (thisAnswer.redirectUrl) {
      return h.redirect(thisAnswer.redirectUrl)
    }
  }

  const errorList = []

  // ERROR: no selection
  if (
    (validate && validate.errorEmptyField) &&
    (payload === {} || !Object.keys(payload).includes(yarKey) || payload[yarKey] === '')
  ) {
    const errorTextNoSelection = validate.errorEmptyField
    return customiseErrorText(value, currentQuestion, errorList, errorTextNoSelection, yarKey, h, request)
  }

  // ERROR: mandatory checkbox / radiobutton not selected
  const requiredAnswer = answers.find(answer => (answer.mustSelect))

  if ((!!requiredAnswer) && (!value || !value.includes(requiredAnswer.value))) {
    const errorMustSelect = requiredAnswer.errorMustSelect
    return customiseErrorText(value, currentQuestion, errorList, errorMustSelect, yarKey, h, request)
  }

  // pages with further checks
  switch (yarKey) {
    case 'projectCost': {
      const { isEligible } = getGrantValues(value, currentQuestion.grantInfo)

      if (!isEligible) {
        return h.view('not-eligible', NOT_ELIGIBLE)
      }
    }
  }

  // ALL GOOD -> show nexturl
  return h.redirect(nextUrl)
}

const getPostHandler = (currentQuestion) => {
  return (request, h) => {
    return showPostPage(currentQuestion, request, h)
  }
}

const drawSectionPostRequests = (section) => {
  return section.questions.map((question) => {
    return {
      method: 'POST',
      path: `${urlPrefix}/${question.url}`,
      handler: getPostHandler(question)
    }
  })
}

let pages = questionBank.sections.map(section => drawSectionGetRequests(section))
pages = [...pages, ...questionBank.sections.map(section => drawSectionPostRequests(section))]

module.exports = pages
