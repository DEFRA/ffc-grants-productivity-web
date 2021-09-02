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
  projectImpacts: Joi.string().allow(null),
  dataAnalytics: Joi.string().allow(null),
  energySource: Joi.array().allow(null).items(Joi.string()),
  agriculturalSector: Joi.string().allow(null),
  roboticProjectImpacts: Joi.string().allow(null)
})

function getDesirabilityAnswers (request) {
  try {
    console.log('in getDisirability')
    const val = {
      projectSubject: getYarValue(request, 'projectSubject'),
      projectImpacts: getYarValue(request, 'projectImpacts'),
      dataAnalytics: getYarValue(request, 'dataAnalytics'),
      energySource: getYarValue(request, 'energySource'),
      agriculturalSector: getYarValue(request, 'agriculturalSector'),
      roboticProjectImpacts: getYarValue(request, 'technology')
    }
    console.log(val)
    const result = desirabilityAnswersSchema.validate(val, {
      abortEarly: false
    })
    if (result.error) {
      throw new Error(`The scoring data is invalid. ${result.error.message}`)
    }
    return result.value
  } catch (ex) {
    console.log(ex, 'error')
    return null
  }
}

module.exports = {
  getDesirabilityAnswers,
  getAllDetails
}
