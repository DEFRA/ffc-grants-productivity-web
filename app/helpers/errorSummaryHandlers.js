const { getModel } = require('../helpers/models')
const { getHtml } = require('../helpers/conditionalHTML')
const { getYarValue } = require('../helpers/session')
const { getQuestionAnswer } = require('../helpers/utils')
const { urlPrefix } = require('../config/server')
const { SELECT_VARIABLE_TO_REPLACE } = require('../helpers/regex')

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

    case 'STANDALONE_ANSWER': {
      const selectedAnswer = [value].flat()
      const {
        standaloneObject: {
          questionKey: standaloneQuestionKey,
          answerKey: standaloneAnswerKey
        }
      } = details
      const standAloneAnswer = getQuestionAnswer(standaloneQuestionKey, standaloneAnswerKey)

      if (selectedAnswer.includes(standAloneAnswer)) {
        return selectedAnswer.length === 1
      }
      return true
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

    case 'MAX_ONLY': {
      const { max } = details
      return (value <= max)
    }

    case 'MAX_SELECT': {
      const { max } = details
      return ([value].flat().length <= max)
    }
    default:
      return false
  }
}

const checkInputError = (validate, isconditionalAnswer, payload, yarKey) => {
  return validate.find(
    ({ type, dependentKey, ...details }) => (isconditionalAnswer && dependentKey)
      ? (validateAnswerField(payload[dependentKey], type, details, payload) === false)
      : !dependentKey && (validateAnswerField(payload[yarKey], type, details, payload) === false)
  )
}

const customiseErrorText = (value, currentQuestion, errorList, h, request) => {
  const { yarKey, type, conditionalKey, conditionalLabelData } = currentQuestion
  let conditionalHtml

  if (yarKey === 'technologyDescription') {
    const techItem = getYarValue(request, 'technologyItems')
    if (techItem !== 'Other robotics or automatic technology') {
      const descriptionTitle = currentQuestion.title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) =>
        getYarValue(request, additionalYarKeyName).toLowerCase()
      )
      currentQuestion = {
        ...currentQuestion,
        title: descriptionTitle
      }
    }
    else if (getYarValue(request, 'roboticAutomatic') === 'Robotic') {
      currentQuestion = {
        ...currentQuestion,
        title: 'Describe the robotic technology'
      }
    } else if (getYarValue(request, 'roboticAutomatic') === 'Automatic') {
      currentQuestion = {
        ...currentQuestion,
        title: 'Describe the automatic technology'
      }
    }
  }

  if(yarKey === 'technologyItems') {
    if(getYarValue(request, 'applicant') === 'Contractor') {
      currentQuestion = {
        ...currentQuestion,
        answers: currentQuestion.answers.filter((option) => option.contractorOnly)
      }

      if(getYarValue(request, 'tenancy') === 'Yes') {
        currentQuestion.backUrl = `${urlPrefix}/tenancy`
      } else {
        currentQuestion.backUrl = `${urlPrefix}/project-responsibility`
      }
    } 
  }

  if (yarKey === 'roboticEligibility') {
    const selectedOption = getYarValue(request, 'technologyItems')
    const shortListAnswers = ['technology-items-A4', 'technology-items-A5', 'technology-items-A6', 'technology-items-A7', 'technology-items-A8']
      .map((item) => getQuestionAnswer('technology-items', item))

    if(shortListAnswers.includes(selectedOption)) {
      currentQuestion.backUrl = `${urlPrefix}/technology-items`
    }

    const title_dict = {
      'technology-items-A8': 'Do your slurry robots fit the eligibility criteria?',
      'technology-items-A4': 'Does your driverless robotic tractor or platform fit the eligibility criteria?',
      'technology-items-A6': 'Does your voluntary robotic milking system fit the eligibility criteria?',
      'technology-items-A5': 'Does your robotic spraying technology fit the eligiblity criteria?'

    }
    const technologyItems = getYarValue(request, 'technologyItems')
  
    Object.keys(title_dict).forEach((value) => {
      if (technologyItems === getQuestionAnswer('technology-items', value)) {
        currentQuestion = {
          ...currentQuestion,
          title: title_dict[value]
        }
      }
    })
  }

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
  const { yarKey, answers, validate } = currentQuestion
  const conditionalAnswer = answers?.find(answer => answer.conditional)
  const errorHrefList = []
  let isconditionalAnswer
  let placeholderInputError
  if (currentQuestion.type === 'multi-input') {
    const { allFields } = currentQuestion

    allFields.forEach(
      ({ yarKey: inputYarKey, validate: inputValidate, answers: inputAnswers }) => {
        isconditionalAnswer = inputAnswers?.find(answer => answer.conditional)?.value === payload[inputYarKey]

        if (inputValidate) {
          placeholderInputError = checkInputError(inputValidate, isconditionalAnswer, payload, inputYarKey)

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
  }
  if (Object.keys(payload).length === 0 && currentQuestion.type) {
    placeholderInputError = validate.find(
      ({ type, dependentKey, ...details }) => (validateAnswerField(payload[yarKey], type, details, payload) === false))

    errorHrefList.push({
      text: placeholderInputError.error,
      href: `#${placeholderInputError.dependentKey ?? yarKey}`
    })
    return customiseErrorText('', currentQuestion, errorHrefList, h, request)
  }

  const payloadValue = typeof payload[yarKey] === 'string' ? payload[yarKey].trim() : payload[yarKey]
  isconditionalAnswer = payload[yarKey]?.includes(conditionalAnswer?.value)
  if (validate) {
    placeholderInputError = checkInputError(validate, isconditionalAnswer, payload, yarKey)

    if (placeholderInputError) {
      errorHrefList.push({
        text: placeholderInputError.error,
        href: `#${placeholderInputError.dependentKey ?? yarKey}`
      })
    }
  }

  if (errorHrefList.length > 0) {
    return customiseErrorText(payloadValue, currentQuestion, errorHrefList, h, request)
  }
}

module.exports = {
  customiseErrorText,
  checkErrors
}
