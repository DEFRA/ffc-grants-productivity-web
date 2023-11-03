const { YAR_KEYS } = require('../config/question-bank')
const Joi = require('joi')
const { getYarValue } = require('../helpers/session')
const { getQuestionAnswer } = require('../helpers/utils')

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
  dataAnalytics: Joi.string().allow(null),
  energySource: Joi.array().allow(null).items(Joi.string()),
  technologyUse: Joi.string().allow(null),
  labourReplaced: Joi.string().allow(null),
  eligibilityCriteria: Joi.array().allow(null).items(Joi.array.items(Joi.string())),
  agriculturalSectorRobotics: Joi.array().allow(null).items(Joi.string()),
  agriculturalSectorSolar: Joi.array().allow(null).items(Joi.string()),
  solarTechnologies: Joi.array().allow(null).items(Joi.string()),
  solarOutput: Joi.string().allow(null)
})

function getDesirabilityAnswers (request) {
  try {
    const agriculturalSector = []
    if (!Array.isArray(getYarValue(request, 'agriculturalSector'))) {
      agriculturalSector.push(getYarValue(request, 'agriculturalSector'))
    }
    let val = {}
    const projectSubject = getYarValue(request, 'projectSubject')
    if (projectSubject === getQuestionAnswer('project-subject', 'project-subject-A1')) {
      const energySource = []
      if (!Array.isArray(getYarValue(request, 'energySource'))) {
        energySource.push(getYarValue(request, 'energySource'))
      }
      // if projectItemsList exists, for each item add projectItemsList.criteria individually
      // if doesn't exist, add one answer with 'Not applicable'

      // const eligibilityCriteria = []
      // if (getYarValue(request, 'projectItemsList') === undefined) {
      //   eligibilityCriteria.push('Not applicable')
      // } else if (!Array.isArray(getYarValue(request, 'projectItemsList'))) {
      //   eligibilityCriteria.push(getYarValue(request, 'projectItemsList'))
      // }
      val = {
        dataAnalytics: getYarValue(request, 'dataAnalytics'),
        energySource: energySource.length > 0 ? energySource : getYarValue(request, 'energySource'),
        technologyUse: getYarValue(request, 'technologyUse'),
        labourReplaced: getYarValue(request, 'labourReplaced'),
        // eligibilityCriteria: eligibilityCriteria.length > 0 ? eligibilityCriteria : getYarValue(request, 'projectItemsList'),
        agriculturalSectorRobotics: agriculturalSector.length > 0 ? agriculturalSector : getYarValue(request, 'agriculturalSector'),
        roboticProjectImpacts: getYarValue(request, 'technology')
      }
    } else {
      const solarTechnologies = []
      if (!Array.isArray(getYarValue(request, 'solarTechnologies'))) {
        solarTechnologies.push(getYarValue(request, 'solarTechnologies'))
      }
      val = {
        agriculturalSectorSolar: agriculturalSector.length > 0 ? agriculturalSector : getYarValue(request, 'agriculturalSector'),
        solarTechnologies: solarTechnologies.length > 0 ? solarTechnologies : getYarValue(request, 'solarTechnologies'),
        solarOutput: getYarValue(request, 'solarOutput'),
        projectSubject: getYarValue(request, 'projectSubject')
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
