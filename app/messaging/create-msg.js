const { YAR_KEYS } = require('../config/question-bank')
const Joi = require('joi')
const { getYarValue } = require('../helpers/session')

function getAllDetails (request, confirmationId) {
  return YAR_KEYS.reduce(
    (allDetails, key) => {
      allDetails[key] = getYarValue(request, key)
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
  agriculturalSector: Joi.array().allow(null).items(Joi.string()),
  roboticProjectImpacts: Joi.string().allow(null)
})

function getDesirabilityAnswers (request) {
  try {
    let val = {}
    const projectSubject = getYarValue(request, 'projectSubject')
    if (projectSubject === 'Robotics and innovation') {
      const energySource = []
      if (!Array.isArray(getYarValue(request, 'energySource'))) {
        energySource.push(getYarValue(request, 'energySource'))
      }
      const agriculturalSector = []
      if (!Array.isArray(getYarValue(request, 'agriculturalSector'))) {
        agriculturalSector.push(getYarValue(request, 'agriculturalSector'))
      }
      val = {
        projectSubject: getYarValue(request, 'projectSubject'),
        projectImpacts: getYarValue(request, 'projectImpacts'),
        dataAnalytics: getYarValue(request, 'dataAnalytics'),
        energySource: energySource.length > 0 ? energySource : getYarValue(request, 'energySource'),
        agriculturalSector: agriculturalSector.length > 0 ? agriculturalSector : getYarValue(request, 'agriculturalSector'),
        roboticProjectImpacts: getYarValue(request, 'technology')
      }
    } else {
      val = {
        projectSubject: getYarValue(request, 'projectSubject'),
        projectImpacts: getYarValue(request, 'projectImpacts')
      }
    }
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
