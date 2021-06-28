const qb = require('../config/question-bank')

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
const getSingleAnswer = (question) => {
  return {
    classes: 'govuk-radios--inline',
    idPrefix: question.key,
    name: question.key,
    fieldset: {
      legend: {
        text: question.title,
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    items: setLabelData(null, question.answers.map(x => x.value))
  }
}
const geMultiAnswer = (question) => {
  // TODO:
  return { }
}
const getAnswerData = (question) => {
  switch (question.type) {
    case 'single-answer':
      return getSingleAnswer(question)
    case 'multi-answer':
      return geMultiAnswer(question)
    default:
      return getSingleAnswer(question)
  }
}
const getModel = (question) => {
  const model = {
    type: question.type,
    backLink: question.backLink,
    items: getAnswerData(question)
  }
  console.log(model)
  return model
}
const getHandler = (q) => {
  return (request, h) => {
    return h.view('page', getModel(q))
  }
}
const drawSectionGetRequests = (section) => {
  return section.questions.map(q => {
    return {
      method: 'GET',
      path: `/productivity/${q.url}`,
      handler: getHandler(q)
    }
  })
}
const getPostHandler = (q, nextq) => {
  return (request, h) => {
    console.log(q.key, request.payload, 'setYarKkey')
    return h.view('page', getModel(nextq ?? q))
  }
}
const drawSectionPostRequests = (section) => {
  return section.questions.map((q, i, arr) => {
    return {
      method: 'POST',
      path: `/productivity/${q.url}`,
      handler: getPostHandler(q, arr.filter(x => x.order === q.order + 1)[0])
    }
  })
}
let pages = qb.sections.map(x => drawSectionGetRequests(x))
pages = [...pages, ...qb.sections.map(x => drawSectionPostRequests(x))]

module.exports = pages
