const questionBank = require('../config/question-bank')
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

const getModel = (data, question) => {
  const { type, backUrl } = question

  const model = {
    type,
    backUrl,
    items: getCorrectAnswerType(data, question),
    sideBarText: question.sidebar
  }
  return model
}

const showGetPage = (question, request, h) => {
  if (question.maybeEligible) {
    const { url, backUrl, nextUrl, maybeEligibleContent } = question
    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, url, nextUrl, backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  const data = getYarValue(request, question.yarKey) || null
  return h.view('page', getModel(data, question))
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
      path: `/productivity/${question.url}`,
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

  // based on answer -> redirect to pages [not eligible] or [maybe eligible]

  const thisAnswer = answers.find(answer => (answer.value === value))

  if (thisAnswer) {
    if (thisAnswer.notEligible) {
      return h.view('not-eligible', NOT_ELIGIBLE)
    } else if (thisAnswer.redirectUrl) {
      return h.redirect(thisAnswer.redirectUrl)
    }
  }

  const errorList = []

  // no selection -> same error text for [error message] & [error summary]

  if (
    (validate && validate.errorEmptyField) &&
    (payload === {} || !Object.keys(payload).includes(yarKey) || payload[yarKey] === '')
  ) {
    const errorTextNoSelection = validate.errorEmptyField
    const baseModel = getModel(value, currentQuestion)

    baseModel.items = { ...baseModel.items, errorMessage: { text: errorTextNoSelection } }
    errorList.push({
      text: errorTextNoSelection,
      href: `#${yarKey}`
    })

    const modelWithErrors = {
      ...baseModel,
      errorList
    }
    return h.view('page', modelWithErrors)
  }

  // specific redirects to some pages
  switch (yarKey) {
    case 'projectCost': {
      const { isEligible } = getGrantValues(value, currentQuestion.grantInfo)

      if (!isEligible) {
        return h.view('not-eligible', NOT_ELIGIBLE)
      }
    }
  }

  // no issues -> show nexturl
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
      path: `/productivity/${question.url}`,
      handler: getPostHandler(question)
    }
  })
}

let pages = questionBank.sections.map(section => drawSectionGetRequests(section))
pages = [...pages, ...questionBank.sections.map(section => drawSectionPostRequests(section))]

module.exports = pages
