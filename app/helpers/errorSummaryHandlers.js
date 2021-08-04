const { getModel } = require('../helpers/models')

const checkErrors = (payload, currentQuestion, h, request) => {
  const { yarKey, answers, validate } = currentQuestion
  const errorList = []
  const value = payload[Object.keys(payload)[0]]

  if (validate?.errorEmptyField && (payload === {} || !Object.keys(payload).includes(yarKey) || payload[yarKey] === '')) {
    const errorTextNoSelection = validate.errorEmptyField
    return customiseErrorText(value, currentQuestion, errorList, errorTextNoSelection, yarKey, h, request)
  }
  // ERROR: mandatory checkbox / radiobutton not selected
  const requiredAnswer = answers.find(answer => (answer.mustSelect))

  if ((!!requiredAnswer) && (!value || !value.includes(requiredAnswer.value))) {
    const errorMustSelect = requiredAnswer.errorMustSelect
    return customiseErrorText(value, currentQuestion, errorList, errorMustSelect, yarKey, h, request)
  }

  // ERROR: regex validation
  if (validate?.checkRegex && !validate.checkRegex.regex.test(value)) {
    const errorRegex = validate.checkRegex.error
    return customiseErrorText(value, currentQuestion, errorList, errorRegex, yarKey, h, request)
  }
}

const customiseErrorText = (value, currentQuestion, errorList, errorText, yarKey, h, request) => {
  const baseModel = getModel(value, currentQuestion, request)

  baseModel.items = { ...baseModel.items, errorMessage: { text: errorText } }
  errorList.push({
    text: errorText,
    href: `#${yarKey}`
  })

  const modelWithErrors = {
    ...baseModel,
    errorList
  }
  return h.view('page', modelWithErrors)
}

module.exports = {
  customiseErrorText,
  checkErrors
}
