const { getModel } = require('../helpers/models')
const { getHtml } = require('../helpers/conditionalHTML')
const { getYarValue } = require('../helpers/session')

const validateAnswerField = (value, validationType, details) => {
  switch (validationType) {
    case 'NOT_EMPTY': {
      return (value !== '')
    }

    case 'REGEX': {
      const { regex } = details
      return (!value || regex.test(value))
    }

    case 'MIN_MAX': {
      const { min, max } = details
      return (value >= min && value <= max)
    }

    default:
      return false
  }
}

const customiseErrorText = (value, currentQuestion, errorList, errorText, h, request, errorHrefList) => {
  let conditionalHtml
  if (currentQuestion.conditionalKey) {
    conditionalHtml = getHtml(currentQuestion.conditionalKey, getYarValue(request, currentQuestion.conditionalKey), errorText.includes('postcode') ? errorText : null)
  }
  const baseModel = getModel(value, currentQuestion, request, conditionalHtml)
  const yarKeyHref = errorText.includes('postcode') ? currentQuestion.conditionalKey : currentQuestion.yarKey

  if (errorHrefList) {
    const baseModelItems = baseModel.items.map(thisItem => {
      const matchingErrorHref = errorHrefList.find(thisErrorHref => (thisErrorHref.href === thisItem.id))

      if (matchingErrorHref) {
        errorList.push({
          text: matchingErrorHref.text,
          href: `#${matchingErrorHref.href}`
        })

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
      ...(!errorText.includes('postcode') ? { errorMessage: { text: errorText } } : {})
    }

    errorList.push({
      text: errorText,
      href: `#${yarKeyHref}`
    })
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
      ({ yarKey: inputYarKey, validate: inputValidate }) => {
        if (inputValidate) {
          placeholderInputError = inputValidate.find(
            ({ type, error, ...details }) => (validateAnswerField(payload[inputYarKey], type, details) === false)
          )

          if (placeholderInputError) {
            errorHrefList.push({
              text: placeholderInputError.error,
              href: inputYarKey
            })
          }
        }
      }
    )

    if (errorHrefList.length > 0) {
      return customiseErrorText(payload, currentQuestion, errorList, '', h, request, errorHrefList)
    }
  } else {
    if (Object.keys(payload).length === 0 && currentQuestion.type) {
      const errorTextNoSelection = validate?.errorEmptyField
      return customiseErrorText('', currentQuestion, errorList, errorTextNoSelection, h, request)
    }

    for (let [key, value] of Object.entries(payload)) {
      const noOptionSelected = ((validate?.errorEmptyField && !Object.keys(payload).includes(yarKey)) || payload[yarKey] === '')
      const hasSelectionError = (value.includes(conditionalAnswer?.value) && validate?.conditionalValidate?.errorEmptyField && payload[conditionalKey] === '') || noOptionSelected
      const regexError = (validate?.checkRegex && !validate.checkRegex.regex.test(value))
      const hasRegexValidationError = (payload[yarKey]?.includes(conditionalAnswer?.value) && key === conditionalKey && !validate.conditionalValidate?.checkRegex.regex.test(value)) || regexError

      if (hasSelectionError || hasRegexValidationError) {
        const errorTextNoSelection = hasSelectionError && noOptionSelected ? validate?.errorEmptyField : validate?.conditionalValidate?.errorEmptyField
        const errorTextRegex = regexError ? validate.checkRegex.error : validate.conditionalValidate?.checkRegex?.error
        const errorText = hasSelectionError ? errorTextNoSelection : errorTextRegex
        value = key === conditionalKey ? payload[yarKey] : value
        return customiseErrorText(value, currentQuestion, errorList, errorText, h, request)
      }

      if (maxAnswerCount && typeof payload[yarKey] !== 'string' && payload[yarKey].length > maxAnswerCount) {
        return customiseErrorText(value, currentQuestion, errorList, validate.errorMaxSelect, h, request)
      }
      // ERROR: mandatory checkbox / radiobutton not selected
      const requiredAnswer = answers?.find(answer => (answer.mustSelect))

      if ((!!requiredAnswer) && (!value || !value.includes(requiredAnswer.value))) {
        const errorMustSelect = requiredAnswer.errorMustSelect
        return customiseErrorText(value, currentQuestion, errorList, errorMustSelect, h, request)
      }
    }
  }
}

module.exports = {
  customiseErrorText,
  checkErrors
}
