const { YAR_KEYS } = require('../config/question-bank')
const Joi = require('joi')
const { getYarValue } = require('../helpers/session')

function getAllDetails (request, confirmationId) {
  return YAR_KEYS.reduce(
    (allDetails, key) => {
      allDetails[key] = getYarValue(key)
      return allDetails
    },
    { confirmationId }
  )
}

const desirabilityAnswersSchema = Joi.object({
  projectSubject: Joi.string(),
  projectImpact: Joi.string(),
  dataAnalytics: Joi.array().items(Joi.string()),
  energySource: Joi.array().items(Joi.string()),
  agriculturalSector: Joi.array().items(Joi.string())
})

function getDesirabilityAnswers (request) {
  const val = {
    projectSubject: getYarValue(request, 'projectSubject'),
    projectImpact: getYarValue(request, 'projectImpact'),
    dataAnalytics: getYarValue(request, 'dataAnalytics'),
    energySource: getYarValue(request, 'energySource'),
    agriculturalSector: getYarValue(request, 'irrigationCurrent')
  }
  const result = desirabilityAnswersSchema.validate(val, {
    abortEarly: false
  })
  if (result.error) {
    throw new Error(`The scoring data is invalid. ${result.error.message}`)
  }
  return result.value
}

module.exports = {
  getDesirabilityAnswers,
  getAllDetails
}
