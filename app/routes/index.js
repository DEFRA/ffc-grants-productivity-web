const questionBank = require('../config/question-bank')
const { setYarValue } = require('../helpers/session')

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
const radioButtons = (question) => {
  return {
    classes: question.classes,
    idPrefix: question.key,
    name: question.key,
    fieldset: {
      legend: {
        text: question.title,
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    items: setLabelData(null, question.answers.map(answer => answer.value))

  }
}
const checkBoxes = (question) => {
  // TODO:
  return { }
}
const getOptions = (question) => {
  switch (question.type) {
    case 'single-answer':
      return radioButtons(question)
    case 'multi-answer':
      return checkBoxes(question)
    default:
      return radioButtons(question)
  }
}

const getModel = (question) => {
  const model = {
    type: question.type,
    backLink: question.backLink,
    items: getOptions(question)
  }
  return model
}
const getHandler = (question) => {
  return (request, h) => {
    return h.view('page', getModel(question))
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
    currentQuestion.yarKey = request.payload
    // setYarValue(request, question.key, question.yarKey)
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
