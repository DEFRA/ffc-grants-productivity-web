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
  projectSubject: Joi.string().allow(null),
  dataAnalytics: Joi.string().allow(null),
  energySource: Joi.array().allow(null).items(Joi.string()),
  technologyUse: Joi.string().allow(null),
  labourReplaced: Joi.string().allow(null),
  eligibilityCriteria: Joi.array().allow(null).items(Joi.array().items(Joi.string())),
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
      const projectItemsList = getYarValue(request, 'projectItemsList')

      const energySource = []
      if (!Array.isArray(getYarValue(request, 'energySource'))) {
        energySource.push(getYarValue(request, 'energySource'))
      }

      const eligibilityCriteria = []
      // list in list
      // for each  item in projectItemsList, add projectItemsList.criteriaScore list to eligbiilityCriteria
      if (projectItemsList === null) {
        eligibilityCriteria.push(['Not applicable'])
      } else {
        for (item in projectItemsList) {
          eligibilityCriteria.push(projectItemsList[item].criteriaScore)
        }
      }

      console.log(eligibilityCriteria, 'eligibilityCriteria')

      let labourReplaced = ''
      if (getYarValue(request, 'labourReplaced') === null) {
        labourReplaced = 'labour-replaced-A5'
      }

      val = {
        dataAnalytics: getYarValue(request, 'dataAnalytics'),
        energySource: energySource.length > 0 ? energySource : getYarValue(request, 'energySource'),
        technologyUse: getYarValue(request, 'technologyUse'),
        labourReplaced: getYarValue(request, 'labourReplaced') === null ? labourReplaced : getYarValue(request, 'labourReplaced'),
        eligibilityCriteria: eligibilityCriteria,
        agriculturalSectorRobotics: agriculturalSector.length > 0 ? agriculturalSector : getYarValue(request, 'agriculturalSector'),
      }
    } else {
      const solarTechnologies = []
      if (!Array.isArray(getYarValue(request, 'solarTechnologies'))) {
        solarTechnologies.push(getYarValue(request, 'solarTechnologies'))
      }

      let solarOutput = ''
      if (getYarValue(request, 'solarOutput') === null) {
        solarOutput = 'solar-output-A6'
      }

      val = {
        agriculturalSectorSolar: agriculturalSector.length > 0 ? agriculturalSector : getYarValue(request, 'agriculturalSector'),
        solarTechnologies: solarTechnologies.length > 0 ? solarTechnologies : getYarValue(request, 'solarTechnologies'),
        solarOutput: getYarValue(request, 'solarOutput') === null ? solarOutput : getYarValue(request, 'solarOutput'),
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
