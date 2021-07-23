const questionBank = require('../config/question-bank')
const { setYarValue, getYarValue } = require('../helpers/session')
const { getGrantValues } = require('../helpers/grants-info')
const { getLastPathAddress } = require('../helpers/utils')

function isChecked (data, option) {
  return !!data && data.includes(option)
}

function setLabelData (data, labelData) {
  return labelData.map((label) => {
    if (typeof (label.value) === 'string' && label.value !== 'divider') {
      return {
        value: label.value,
        text: label.value,
        hint: label.hint,
        checked: isChecked(data, label.value),
        selected: data === label.value
      }
    }
    if (label.value === 'divider') {
      return { divider: 'or' }
    }
    const { text, value, hint } = label
    return {
      value,
      text,
      hint,
      checked: isChecked(data, value),
      selected: data === value
    }
  })
}

const radioButtons = (data, question) => {
  return {
    classes: question.classes,
    idPrefix: question.yarKey,
    name: question.yarKey,
    fieldset: {
      legend: {
        text: question.title,
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    items: setLabelData(data, question.answers)
  }
}

const checkBoxes = (data, question) => {
  return {
    classes: question.classes,
    idPrefix: question.yarKey,
    name: question.yarKey,
    fieldset: {
      legend: {
        text: question.title,
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    hint: {
      text: question.hint
    },
    items: setLabelData(data, question.answers)
  }
}

const inputBoxes = (question) => {
  return {
    id: question.id,
    name: question.name,
    classes: 'govuk-input--width-10',
    prefix: question.prefix,
    suffix: question.suffix,
    label: question.label,
    hint: question.hint
  }
}

const getOptions = (data, question) => {
  switch (question.type) {
    case 'single-answer':
      return radioButtons(data, question)
    case 'multi-answer':
      return checkBoxes(data, question)
    case 'input':
      return inputBoxes(question)
    default:
      return radioButtons(data, question)
  }
}

const getModel = (data, question) => {
  const model = {
    type: question.type,
    backLink: question.backLink,
    items: getOptions(data, question),
    sideBarText: question.sidebar
  }
  return model
}

const getHandler = (question) => {
  return (request, h) => {
    const data = getYarValue(request, question.yarKey) || null
    return h.view('page', getModel(data, question))
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

const showNextPage = (currentQuestion, request, h) => {
  const { yarKey, answers, url, ineligibleContent, nextUrl, maybeEligibleContent, validate } = currentQuestion
  const MAYBE_ELIGIBLE = { ...maybeEligibleContent, url, nextUrl, backUrl: getLastPathAddress(url) }
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: getLastPathAddress(url) }
  const payload = request.payload
  const value = payload[Object.keys(payload)[0]]

  setYarValue(request, yarKey, value)

  // based on answer -> redirect to pages [not eligible] or [maybe eligible]

  if (answers.find(answer => (answer.value === value && !answer.isEligible))) {
    return h.view('not-eligible', NOT_ELIGIBLE)
  } else if (answers.find(answer => (answer.value === value && answer.isEligible === 'maybe'))) {
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
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
      const { isEligible } = getGrantValues(value)

      return isEligible
        ? h.view('maybe-eligible', MAYBE_ELIGIBLE)
        : h.view('not-eligible', NOT_ELIGIBLE)
    }
  }

  // no issues -> show nexturl
  return h.redirect(nextUrl)
}

const getPostHandler = (currentQuestion) => {
  return (request, h) => {
    return showNextPage(currentQuestion, request, h)
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
