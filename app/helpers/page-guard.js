const { getYarValue } = require('../helpers/session')
const { startPageUrl, serviceEndDate, serviceEndTime } = require('../config/server')
const { getQuestionAnswer } = require('./utils')

function guardPage (request, guardData, rule = null) {
  let result = false
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
    // filter list of answers with keys?

    // make an object of question as key and answers for said question?

    let preValidationList = []

    for(let i=0; i<guardData.preValidationKeys.length; i++) {
      preValidationList.push({
       key: guardData.preValidationKeys[i], 
       values: (guardData.preValidationAnswer.filter((answer) => answer.startsWith(guardData.preValidationUrls[i]))),
       url: guardData.preValidationUrls[i]
      }
      );
    }

    console.log('should be a formatted list combining all answewrs and relevant values in one object', preValidationList)

    // should format preValidations as below
    // [{
    //   key: 'key name',
    //   values: ['value 1', 'value 2'],
    //   url: 'url'
    // }]

    switch (guardData.preValidationRule){
      case 'AND':
        // check for all keys (that every key and value pair exists)

        for (let i = 0; i< preValidationList.length; i++) {
          if (preValidationList[i].values.filter((answer) => getQuestionAnswer(preValidationList[i].key, answer) === getYarValue(request, preValidationList[i].key)).length === 0) {
            return true
          }
        }
        return false

      case 'OR':
        // check for one of the keys (if any key value pair exists)

        for (let i = 0; i< preValidationList.length; i++) {
          if (preValidationList[i].values.filter((answer) => getQuestionAnswer(preValidationList[i].url, answer) === getYarValue(request, preValidationList[i].key)).length > 0) {
            return false
          }
        }
        return true

      case 'NOT':
        // check if answer exists in list (if key and value pair contains needed answer)

         for (let i = 0; i< preValidationList.length; i++) {
          if (preValidationList[i].values.filter((answer) => getQuestionAnswer(preValidationList[i].url, answer) === getYarValue(request, preValidationList[i].key)).length > 0) {
            return true
          }
        }

        return false

      case 'SOLARAND':
        // check for a type of journey and another requirement (solar + project repsonsibility etc)

        // check yar value of journey
        if (getYarValue(request, 'projectSubject') === getQuestionAnswer('projectSubject', 'project-subject-A1')) {
          return true
        }

        for (let i = 0; i< preValidationList.length; i++) {
          if (preValidationList[i].values.filter((answer) => getQuestionAnswer(preValidationList[i].url, answer) === getYarValue(request, preValidationList[i].key)).length > 0) {
            return false
          }
        }
        return true

      case 'ROBOTAND':
        // check for a type of journey and another requirement (solar + project repsonsibility etc)

        if (getYarValue(request, 'projectSubject') === getQuestionAnswer('project-subject', 'project-subject-A2')) {
          return true
        }

        for (let i = 0; i< preValidationList.length; i++) {
          if (preValidationList[i].values.filter((answer) => getQuestionAnswer(preValidationList[i].url, answer) === getYarValue(request, preValidationList[i].key)).length > 0) {
            return false
          }
        }
        return true
  
    }   

  }
  return result
}

module.exports = { guardPage }
