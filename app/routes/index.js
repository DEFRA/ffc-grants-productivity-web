const questionBank = require('../config/question-bank')
const { setYarValue, getYarValue } = require('../helpers/session')

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

const textPages = (question) => {
  return {
    header: question.header,
    id: question.id,
    name: question.name,
    classes: question.classes,
    content: question.content,
    warning: question.warning
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
    case 'text':
      return textPages(question)
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

const getGrantValues = (projectCostValue, grantPercentage) => {
  const calculatedGrant = Number(grantPercentage * projectCostValue / 100).toFixed(2)
  const remainingCost = Number(projectCostValue - calculatedGrant).toFixed(2)
  return { calculatedGrant, remainingCost }
}

const showNextPage = (answers, valeOfChosenAnswer, h, notEligible, maybeEligible, nextPageUrl, grant) => {
  const { minGrant, maxGrant, grantPercentage } = grant
  const { calculatedGrant } = getGrantValues(valeOfChosenAnswer, grantPercentage)
  if (answers.find(answer => (answer.value === valeOfChosenAnswer && !answer.isEligible) || (calculatedGrant < minGrant) || (calculatedGrant > maxGrant))) {
    return h.view('not-eligible', notEligible)
  } else if (answers.find(answer => (answer.value === valeOfChosenAnswer && answer.isEligible === 'maybe'))) {
    return h.view('maybe-eligible', maybeEligible)
  } else {
    return h.redirect(nextPageUrl)
  }
}

const getPostHandler = (currentQuestion) => {
  const { yarKey, answers, url, ineligibleContent, nextUrl, maybeEligibleContent } = currentQuestion
  const grant = currentQuestion.grant || ''
  const MAYBE_ELIGIBLE = { url, nextUrl, maybeEligibleContent }
  const NOT_ELIGIBLE = { url, ineligibleContent }
  return (request, h) => {
    const valueChosenAnswer = request.payload[Object.keys(request.payload)[0]]
    setYarValue(request, yarKey, valueChosenAnswer)
    return showNextPage(answers, valueChosenAnswer, h, NOT_ELIGIBLE, MAYBE_ELIGIBLE, nextUrl, grant)
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
