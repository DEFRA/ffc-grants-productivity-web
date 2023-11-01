const { getYarValue } = require('../helpers/session')

const getCheckDetailsModel = (request, question, backUrl, nextUrl) => {

  return ({
    ...question.pageData,
    backUrl,
    nextUrl,
  })
}

const getEvidenceSummaryModel = (request, question, backUrl, nextUrl) => {
  const roboticAutomatic = getYarValue(request, 'roboticAutomatic')
  const technologyItems = getYarValue(request, 'technologyItems')

  return ({
    ...question.pageData,
    backUrl,
    nextUrl,
    roboticAutomatic,
    technologyItems
  })
}


module.exports = {
  getCheckDetailsModel,
  getEvidenceSummaryModel
}
