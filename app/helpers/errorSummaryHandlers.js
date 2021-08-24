const { getDefaultPageModel } = require('../helpers/models')
const { getHtml } = require('../helpers/conditionalHTML')
const { getYarValue } = require('../helpers/session')

const customiseErrorText = (value, currentQuestion, errorList, errorText, h, request, errorHrefList) => {
  let yarkeyHref = currentQuestion.yarKey
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
  yarkeyHref = errorText.includes('postcode') ? currentQuestion.conditionalKey : yarkeyHref

  if (errorHrefList) {
    const baseModelItemsContent = baseModel.items.content.map(thisContent => {
      const matchingErrorHref = errorHrefList.find(thisErrorHref => (thisErrorHref.href === thisContent.id))

      if (matchingErrorHref) {
        errorList.push({
          text: matchingErrorHref.text,
          href: `#${matchingErrorHref.href}`
        })

        return {
          ...thisContent,
          errorMessage: { text: matchingErrorHref.text }
        }
      }

      return thisContent
    })

    baseModel.items = {
      ...baseModel.items,
      content: baseModelItemsContent
    }
  } else {
    baseModel.items = {
      ...baseModel.items,
      ...(!errorText.includes('postcode') ? { errorMessage: { text: errorText } } : {})
    }

    errorList.push({
      text: errorText,
      href: `#${yarkeyHref}`
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
  const conditionalAnswer = answers.find(answer => answer.conditional)

  const PAYLOAD_KEYS = Object.keys(payload)
  const PAYLOAD_ENTRIES = Object.entries(payload)

  if (currentQuestion.type === 'inputList') {
    const errorHrefList = []
    let placeholderValidateInput

    answers.forEach(
      ({ key, validateInput }) => {
        placeholderValidateInput = validateInput.find(
          (thisValidation) => (thisValidation.callback(payload[key]) === false)
        )

        if (placeholderValidateInput) {
          errorHrefList.push({
            text: placeholderValidateInput.error,
            href: key
          })
        }
      }
    )

    if (errorHrefList.length > 0) {
      return customiseErrorText(payload, currentQuestion, errorList, '', h, request, errorHrefList)
    }
  } else {
    if (PAYLOAD_KEYS.length === 0 && currentQuestion.type) {
      const errorTextNoSelection = validate?.errorEmptyField
      return customiseErrorText('', currentQuestion, errorList, errorTextNoSelection, h, request)
    }

    for (let [payloadKey, payloadValue] of PAYLOAD_ENTRIES) {
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
}

module.exports = {
  checkErrors
}
