const { getYarValue } = require('../helpers/session')
const { startPageUrl, serviceEndDate, serviceEndTime } = require('../config/server')
const { getQuestionAnswer } = require('./utils')

function guardPage (request, guardData) {
  const result = false
  const currentUrl = request.url.pathname.split('/').pop()
  const today = new Date(new Date().toDateString())
  const decomissionServiceDate = new Date(serviceEndDate)
  const time = new Date().toLocaleTimeString('it-IT')
  const dateExpired = +today > +decomissionServiceDate
  const expiringToday = (+today === +decomissionServiceDate) && (time > serviceEndTime)
  const serviceDecommissioned = expiringToday || dateExpired
  const isServiceDecommissioned = (request.url.pathname !== startPageUrl && currentUrl !== 'login' && serviceDecommissioned)

  if (isServiceDecommissioned) return isServiceDecommissioned
  if (guardData) {
    if (Array.isArray(guardData)) {
      return guardData.filter(dependcyKey => getYarValue(request, dependcyKey) === null).length > 0
    }
    // filter list of answers with keys?

    const preValidationList = []

    for (let i = 0; i < guardData.preValidationKeys.length; i++) {
      preValidationList.push({
        key: guardData.preValidationKeys[i],
        values: (guardData?.preValidationAnswer.filter((answer) => answer.startsWith(guardData.preValidationUrls[i]))),
        url: guardData.preValidationUrls[i]
      }
      )
    }

    // should format preValidations as below
    //   preValidationObject: {
    //     preValidationKeys: ['consentOptional'],
    //     preValidationAnswer: ['key1', 'key2'], // make it optional in case of OR
    //     preValidationRule: 'AND',
    //     preValidationUrls: ['project-subject']
    // },

    switch (guardData?.preValidationRule) {
      case 'AND':
        // check for all keys (that every key and value pair exists)

        for (let i = 0; i < preValidationList.length; i++) {
          if (preValidationList[i]?.values?.filter((answer) => getQuestionAnswer(preValidationList[i].url, answer) === getYarValue(request, preValidationList[i].key)).length === 0) {
            return true
          }
        }
        return false


      case 'OR':
        // check for one of the keys (if any key value pair exists)

        if (guardData?.andCheck && getYarValue(request, 'projectSubject') != getQuestionAnswer('project-subject', guardData.andCheck)) {
          return true
        }

        for (let i = 0; i < preValidationList.length; i++) {
          if (preValidationList[i].values.filter((answer) => getQuestionAnswer(preValidationList[i].url, answer) === getYarValue(request, preValidationList[i].key)).length > 0) {
            return false
          }
        }
        return true

      case 'NOT':
        // check if answer exists in list (if key and value pair contains needed answer)

        for (let i = 0; i < preValidationList.length; i++) {
          if (preValidationList[i].values.filter((answer) => getQuestionAnswer(preValidationList[i].url, answer) === getYarValue(request, preValidationList[i].key)).length > 0) {
            return true
          }
        }

        return false
    }
  }
  return result
}

module.exports = { guardPage }
