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

const getPostHandler = (currentQuestion) => {
  const { yarKey, answers, url, ineligibleContent, nextUrl, maybeEligibleContent } = currentQuestion
  const MAYBE_ELIGIBLE = { url, nextUrl, maybeEligibleContent }
  const NOT_ELIGIBLE = { url, ineligibleContent }

  return (request, h) => {
    const value = request.payload[Object.keys(request.payload)[0]]
    setYarValue(request, yarKey, value)
    if (answers.find(answer => answer.value === value && !answer.isEligible)) {
      return h.view('not-eligible', NOT_ELIGIBLE)
    } else if (answers.find(answer => answer.value === value && answer.isEligible === 'maybe')) return h.view('maybe-eligible', MAYBE_ELIGIBLE)

    return h.redirect(nextUrl)
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
