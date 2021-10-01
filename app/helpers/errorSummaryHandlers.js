const { getModel } = require('../helpers/models')
const { getHtml } = require('../helpers/conditionalHTML')
const { getYarValue } = require('../helpers/session')

const validateAnswerField = (value, validationType, details, payload) => {
  switch (validationType) {
    case 'NOT_EMPTY': {
      return (!!value)
    }

    case 'NOT_EMPTY_EXTRA': {
      if (value) {
        return true
      }

      const { extraFieldsToCheck } = details
      return extraFieldsToCheck.some(extraField => (
        !!payload[extraField]
      ))
    }

    case 'REGEX': {
      const { regex } = details
      return (!value || regex.test(value))
    }

    case 'MIN_MAX_CHARS': {
      const { min, max } = details
      return (value.length >= min && value.length <= max)
    }

    case 'MIN_MAX': {
      const { min, max } = details
      return (value >= min && value <= max)
    }
    default:
      return false
  }
}

const customiseErrorText = (value, currentQuestion, errorList, h, request) => {
  const { yarKey, type, conditionalKey, conditionalLabelData } = currentQuestion
  let conditionalHtml

  if (conditionalKey) {
    const conditionalFieldError = errorList.find(thisErrorHref => thisErrorHref.href.includes(conditionalKey))?.text
    const conditionalFieldValue = (type === 'multi-input') ? getYarValue(request, yarKey)[conditionalKey] : getYarValue(request, conditionalKey)
    conditionalHtml = getHtml(conditionalKey, conditionalLabelData, conditionalFieldValue, conditionalFieldError)
  }
  const baseModel = getModel(value, currentQuestion, request, conditionalHtml)

  if (type === 'multi-input') {
    const baseModelItems = baseModel.items.map(thisItem => {
      const matchingErrorHref = errorList.find(thisErrorHref => thisErrorHref.href.includes(thisItem.id))

      if (matchingErrorHref) {
        return {
          ...thisItem,
          errorMessage: { text: matchingErrorHref.text }
        }
      }
      return thisItem
    })
    baseModel.items = [
      ...baseModelItems
    ]
  } else {
    baseModel.items = {
      ...baseModel.items,
      ...(errorList[0].href.includes(yarKey) ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
  const modelWithErrors = {
    ...baseModel,
    errorList
  }
  return h.view('page', modelWithErrors)
}

const checkErrors = (payload, currentQuestion, h, request) => {
  const { yarKey, conditionalKey, answers, validate, maxAnswerCount } = currentQuestion
  const errorList = []
  const conditionalAnswer = answers?.find(answer => answer.conditional)

  if (currentQuestion.type === 'multi-input') {
    const { allFields } = currentQuestion
    const errorHrefList = []
    let placeholderInputError

    allFields.forEach(
      ({ yarKey: inputYarKey, validate: inputValidate, answers: inputAnswers }) => {
        const isconditionalAnswer = inputAnswers?.find(answer => answer.conditional)?.value === payload[inputYarKey]

        if (inputValidate) {
          placeholderInputError = inputValidate.find(
            ({ type, dependentKey, ...details }) => (isconditionalAnswer && dependentKey)
              ? (validateAnswerField(payload[dependentKey], type, details, payload) === false)
              : !dependentKey && (validateAnswerField(payload[inputYarKey], type, details, payload) === false)
          )

          if (placeholderInputError) {
            errorHrefList.push({
              text: placeholderInputError.error,
              href: `#${placeholderInputError.dependentKey ?? inputYarKey}`
            })
          }
        }
      }
    )

    if (errorHrefList.length > 0) {
      return customiseErrorText(payload, currentQuestion, errorHrefList, h, request)
    }
  } else {
    if (Object.keys(payload).length === 0 && currentQuestion.type) {
      const errorTextNoSelection = validate?.errorEmptyField
      errorList.push({
        text: errorTextNoSelection,
        href: `#${yarKey}`
      })
      return customiseErrorText('', currentQuestion, errorList, h, request)
    }
    //* ** This loop needs refactoring *** */
    for (const [key, value] of Object.entries(payload)) {
      let payloadValue = typeof value === 'string' ? value.trim() : value
      if (key !== 'secBtn') {
        const noOptionSelected = ((validate?.errorEmptyField && !Object.keys(payload).includes(yarKey)) || payload[yarKey] === '')
        const hasSelectionError = (payloadValue.includes(conditionalAnswer?.value) && validate?.conditionalValidate?.errorEmptyField && payload[conditionalKey].trim() === '') || noOptionSelected
        const regexError = (validate?.checkRegex && !validate.checkRegex.regex.test(payloadValue))
        const hasRegexValidationError = (payload[yarKey]?.includes(conditionalAnswer?.value) && key === conditionalKey && !validate.conditionalValidate?.checkRegex.regex.test(payloadValue)) || regexError

        if (hasSelectionError || hasRegexValidationError) {
          const errorTextNoSelection = hasSelectionError && noOptionSelected ? validate?.errorEmptyField : validate?.conditionalValidate?.errorEmptyField
          const errorTextRegex = regexError ? validate.checkRegex.error : validate.conditionalValidate?.checkRegex?.error
          const errorText = hasSelectionError ? errorTextNoSelection : errorTextRegex
          const href = errorText && !noOptionSelected && !regexError ? conditionalKey : yarKey
          errorList.push({
            text: errorText,
            href: `#${href}`
          })
          payloadValue = key === conditionalKey ? payload[yarKey] : payloadValue
          return customiseErrorText(payloadValue, currentQuestion, errorList, h, request)
        }

        if (maxAnswerCount && typeof payload[yarKey] !== 'string' && payload[yarKey].length > maxAnswerCount) {
          errorList.push({
            text: validate.errorMaxSelect,
            href: `#${yarKey}`
          })
          return customiseErrorText(payloadValue, currentQuestion, errorList, h, request)
        }
        // ERROR: mandatory checkbox / radiobutton not selected
        const requiredAnswer = answers?.find(answer => (answer.mustSelect))

        if ((!!requiredAnswer) && (!payloadValue || !payloadValue.includes(requiredAnswer.value))) {
          errorList.push({
            text: requiredAnswer.errorMustSelect,
            href: `#${yarKey}`
          })
          return customiseErrorText(payloadValue, currentQuestion, errorList, h, request)
        }
      }
    }
  }
}

module.exports = {
  customiseErrorText,
  checkErrors
}
