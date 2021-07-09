const questionBank = require('../config/question-bank')
const { setYarValue, getYarValue } = require('../helpers/session')

function isChecked (data, option) {
  return !!data && data.includes(option)
}

function setLabelData (data, labelData) {
  return labelData.map((label) => {
    if (typeof (label) === 'string') {
      return {
        value: label,
        text: label,
        checked: isChecked(data, label),
        selected: data === label
      }
    }

    const { text, value } = label
    return {
      value,
      text,
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
    items: setLabelData(data, question.answers.map(answer => answer.value))

  }
}
const checkBoxes = (question) => {
  // TODO:
  return { }
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
    items: getOptions(data, question)
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
const getPostHandler = (currentQuestion, nextUrl) => {
  return (request, h) => {
    const value = request.payload[Object.keys(request.payload)[0]]
    setYarValue(request, currentQuestion.yarKey, value)
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
