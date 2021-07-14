const questionBank = require('../config/question-bank')
const { setYarValue, getYarValue } = require('../helpers/session')

function isChecked (data, option) {
  return !!data && data.includes(option)
}

function setLabelData (data, labelData) {
  return labelData.map((label) => {
    if (typeof (label.value) === 'string') {
      return {
        value: label.value,
        text: label.value,
        hint: label.hint,
        checked: isChecked(data, label.value),
        selected: data === label.value
      }
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

const getOptions = (data, question) => {
  switch (question.type) {
    case 'single-answer':
      return radioButtons(data, question)
    case 'multi-answer':
      return checkBoxes(data, question)
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

const createModelNotEligible = (backUrl, ineligibleContent) => {
  return {
    backLink: backUrl,
    messageContent: ineligibleContent.messageContent,
    insertText: ineligibleContent.insertText,
    messageLink: ineligibleContent.messageLink
  }
}

const maybeEligible = (backUrl, nextPath, maybeEligibleContent) => {
  return {
    backLink: backUrl,
    nextLink: nextPath,
    messageHeader: maybeEligibleContent.messageHeader,
    messageContent: maybeEligibleContent.messageContent
  }
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
const getPostHandler = (currentQuestion, nextUrl) => {
  return (request, h) => {
    const value = request.payload[Object.keys(request.payload)[0]]
    setYarValue(request, currentQuestion.yarKey, value)
    if (currentQuestion.answers.find(answer => answer.value === value && answer.isEligible === false)) {
      return h.view('not-eligible', createModelNotEligible(currentQuestion.url, currentQuestion.ineligibleContent))
    } else if (currentQuestion.answers.find(answer => answer.value === value && answer.isEligible === 'maybe')) {
      return h.view('maybe-eligible', maybeEligible(currentQuestion.url, currentQuestion.nextUrl, currentQuestion.maybeEligibleContent))
    }
    return h.redirect(nextUrl)
  }
}
const drawSectionPostRequests = (section) => {
  return section.questions.map((question) => {
    return {
      method: 'POST',
      path: `/productivity/${question.url}`,
      handler: getPostHandler(question, question.nextUrl)
    }
  })
}
let pages = questionBank.sections.map(section => drawSectionGetRequests(section))
pages = [...pages, ...questionBank.sections.map(section => drawSectionPostRequests(section))]

module.exports = pages
