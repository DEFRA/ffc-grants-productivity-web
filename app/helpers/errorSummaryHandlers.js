const { getDefaultPageModel } = require('../helpers/models')
const { getHtml } = require('../helpers/conditionalHTML')
const { getYarValue } = require('../helpers/session')

const customiseErrorText = (value, currentQuestion, errorList, errorText, h, request, customHref) => {
  let href = customHref || currentQuestion.yarKey
  let conditionalHtml

  if (currentQuestion.conditionalKey) {
    conditionalHtml = getHtml(
      getYarValue(request, currentQuestion.conditionalKey),
      errorText.includes('postcode')
        ? errorText
        : null
    )
  }
  const baseModel = getDefaultPageModel(value, currentQuestion, request, conditionalHtml)
  href = errorText.includes('postcode') ? currentQuestion.conditionalKey : href

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
  const { yarKey, conditionalKey, answers, validate, maxAnswerCount } = currentQuestion
  const errorList = []
  const conditionalAnswer = answers.find(answer => answer.conditional)

  const PAYLOAD_KEYS = Object.keys(payload)
  const PAYLOAD_ENTRIES = Object.entries(payload)

  if (PAYLOAD_KEYS.length === 0 && currentQuestion.type) {
    const errorTextNoSelection = validate?.errorEmptyField
    return customiseErrorText('', currentQuestion, errorList, errorTextNoSelection, h, request)
  }

  for (let [payloadKey, payloadValue] of PAYLOAD_ENTRIES) {
    if (currentQuestion.type === 'inputList') {
      const customHrefList = []

      const firstInvalidAnswer = answers.map(
        ({ key, validateInput }) => {
          if (validateInput.some(
            (thisValidation) => (thisValidation.callback(2) === true)
          )) {
            customHrefList.push(key)
          }

          return validateInput.find(
            (thisValidation) => (thisValidation.callback(2) === true)
          )
        }
      )

      if (firstInvalidAnswer.length > 0) {
        return customiseErrorText(payload, currentQuestion, errorList, firstInvalidAnswer[0].error, h, request, customHrefList[0])
      }
    }

    const noOptionSelected = (
      (validate?.errorEmptyField && !PAYLOAD_KEYS.includes(yarKey)) ||
      payload[yarKey] === ''
    )

    const hasSelectionError = (
      payloadValue.includes(conditionalAnswer?.value) &&
      validate?.conditionalValidate?.errorEmptyField &&
      payload[conditionalKey] === ''
    ) || noOptionSelected

    const regexError = (
      validate?.checkRegex && !validate.checkRegex.regex.test(payloadValue)
    )

    const hasRegexValidationError = (
      payload[yarKey]?.includes(conditionalAnswer?.value) &&
      payloadKey === conditionalKey &&
      !validate.conditionalValidate?.checkRegex.regex.test(payloadValue)
    ) || regexError

    if (hasSelectionError || hasRegexValidationError) {
      const errorTextNoSelection = hasSelectionError && (
        noOptionSelected ? validate?.errorEmptyField : validate?.conditionalValidate?.errorEmptyField
      )

      const errorTextRegex = regexError ? validate.checkRegex.error : validate.conditionalValidate?.checkRegex?.error
      const errorText = hasSelectionError ? errorTextNoSelection : errorTextRegex
      payloadValue = payloadKey === conditionalKey ? payload[yarKey] : payloadValue
      return customiseErrorText(payloadValue, currentQuestion, errorList, errorText, h, request)
    }

    if (maxAnswerCount && typeof payload[yarKey] !== 'string' && payload[yarKey].length > maxAnswerCount) {
      return customiseErrorText(payloadValue, currentQuestion, errorList, validate.errorMaxSelect, h, request)
    }
    // ERROR: mandatory checkbox / radiobutton not selected
    const requiredAnswer = answers.find(answer => (answer.mustSelect))

    if ((!!requiredAnswer) && (!payloadValue || !payloadValue.includes(requiredAnswer.value))) {
      const errorMustSelect = requiredAnswer.errorMustSelect
      return customiseErrorText(payloadValue, currentQuestion, errorList, errorMustSelect, h, request)
    }
  }
}

module.exports = {
  checkErrors
}
