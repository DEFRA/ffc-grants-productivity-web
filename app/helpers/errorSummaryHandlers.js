const { getModel } = require('../helpers/models')
const { getHtml } = require('../helpers/conditionalHTML')
const { getYarValue } = require('../helpers/session')

const customiseErrorText = (value, currentQuestion, errorList, errorText, h, request) => {
  let conditionalHtml
  if (currentQuestion.conditionalKey) {
    conditionalHtml = getHtml(getYarValue(request, currentQuestion.conditionalKey), errorText.includes('postcode') ? errorText : null)
  }
  const baseModel = getModel(value, currentQuestion, request, conditionalHtml)
  const href = errorText.includes('postcode') ? currentQuestion.conditionalKey : currentQuestion.yarKey

  baseModel.items = {
    ...baseModel.items,
    ...(!errorText.includes('postcode') ? { errorMessage: { text: errorText } } : {})
  }

  errorList.push({
    text: errorText,
    href: `#${href}`
  })

  const modelWithErrors = {
    ...baseModel,
    errorList
  }
  return h.view('page', modelWithErrors)
}

const checkErrors = (payload, currentQuestion, h, request) => {
  const { yarKey, conditionalKey, answers, validate } = currentQuestion
  const errorList = []
  const conditionalAnswer = answers.find(answer => answer.conditional)

  const PAYLOAD_KEYS = Object.keys(payload)
  const PAYLOAD_ENTRIES = Object.entries(payload)

  if (PAYLOAD_KEYS.length === 0 && currentQuestion.type) {
    const errorTextNoSelection = validate?.errorEmptyField
    return customiseErrorText('', currentQuestion, errorList, errorTextNoSelection, h, request)
  }

  for (let [payloadKey, payloadValue] of PAYLOAD_ENTRIES) {
    const noOptionSelected = (
      (validate?.errorEmptyField && !PAYLOAD_KEYS.includes(yarKey)) ||
      payload[yarKey] === ''
    )

    const hasSelectionError = noOptionSelected || (
      payloadValue.includes(conditionalAnswer?.payloadValue) &&
      validate?.conditionalValidate?.errorEmptyField &&
      payload[conditionalKey] === ''
    )

    const regexError = (validate?.checkRegex && !validate.checkRegex.regex.test(payloadValue))

    const hasRegexValidationError = regexError || (
      payload[yarKey]?.includes(conditionalAnswer?.payloadValue) &&
      payloadKey === conditionalKey &&
      !validate.conditionalValidate?.checkRegex.regex.test(payloadValue)
    )

    if (hasSelectionError || hasRegexValidationError) {
      const errorTextNoSelection = hasSelectionError &&
        noOptionSelected
        ? validate?.errorEmptyField
        : validate?.conditionalValidate?.errorEmptyField

      const errorTextRegex = regexError
        ? validate.checkRegex.error
        : validate.conditionalValidate?.checkRegex?.error

      const errorText = hasSelectionError
        ? errorTextNoSelection
        : errorTextRegex

      payloadValue = payloadKey === (
        conditionalKey
          ? payload[yarKey]
          : payloadValue
      )
      return customiseErrorText(payloadValue, currentQuestion, errorList, errorText, h, request)
    }

    // ERROR: mandatory checkbox / radiobutton not selected
    const requiredAnswer = answers.find(answer => (answer.mustSelect))

    if ((!!requiredAnswer) && (!payloadValue || !payloadValue.includes(requiredAnswer.payloadValue))) {
      const errorMustSelect = requiredAnswer.errorMustSelect
      return customiseErrorText(payloadValue, currentQuestion, errorList, errorMustSelect, h, request)
    }
  }
}

module.exports = {
  checkErrors
}
