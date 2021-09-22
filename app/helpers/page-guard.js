const { getYarValue } = require('../helpers/session')

const guardPage = (request, guardData) => {
  let result = false
  if (guardData) {
    guardData.forEach(dependcyKey => {
    // check yar session value for each key exists
      if (result === false && getYarValue(request, dependcyKey) === null) {
        result = true
      }
    })
  }
  return result
}

module.exports = { guardPage }
