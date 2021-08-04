const urlPrefix = require('../config/server').urlPrefix
const { questionBank, ALL_QUESTIONS } = require('../config/question-bank')
const { setYarValue } = require('../helpers/session')
const { getGrantValues } = require('../helpers/grants-info')
const { getHandler, getPostHandler } = require('../helpers/handlers')
const { getModel } = require('../helpers/models')

const drawSectionGetRequests = (section) => {
  return section.questions.map(question => {
    return {
      method: 'GET',
      path: `${urlPrefix}/${question.url}`,
      handler: getHandler(question)
    }
  })
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
