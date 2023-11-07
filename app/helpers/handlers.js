const { getYarValue, setYarValue } = require('../helpers/session')
const { getModel } = require('../helpers/models')
const { checkErrors } = require('../helpers/errorSummaryHandlers')
const { getGrantValues } = require('../helpers/grants-info')
const { formatUKCurrency } = require('../helpers/data-formats')
const { SELECT_VARIABLE_TO_REPLACE, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex')
const { getUrl } = require('../helpers/urls')
const { guardPage } = require('../helpers/page-guard')
const { setOptionsLabel } = require('../helpers/answer-options')
const { getQuestionAnswer } = require('../helpers/utils')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const gapiService = require('../services/gapi-service')
const { startPageUrl, urlPrefix } = require('../config/server')

const emailFormatting = require('./../messaging/email/process-submission')

const resetYarValues = (applying, request) => {
  setYarValue(request, 'agentsDetails', null)
  setYarValue(request, 'contractorsDetails', null)
  setYarValue(request, 'farmerDetails', null)
  setYarValue(request, 'reachedCheckDetails', false)
}

const getConfirmationId = (guid, journey) => {
  const prefix = journey.toLowerCase() === 'solar project items' ? 'SO' : 'RI'
  console.log(journey, prefix, 'confirmationId')
  return `${prefix}-${guid.substr(0, 3)}-${guid.substr(3, 3)}`.toUpperCase()
}

// const handleConditinalHtmlData = (type, labelData, yarKey, request) => {
//   const isMultiInput = type === 'multi-input'
//   const label = isMultiInput ? 'sbi' : yarKey
//   const fieldValue = isMultiInput ? getYarValue(request, yarKey)?.sbi : getYarValue(request, yarKey)
//   return getHtml(label, labelData, fieldValue)
// }

const saveValuesToArray = (yarKey, fields) => {
  const result = []

  if (yarKey) {
    fields.forEach(field => {
      if (yarKey[field]) {
        result.push(yarKey[field])
      }
    })
  }

  return result
}
const getContractorFarmerModel = (data, question, request, conditionalHtml) => {
  let MODEL = getModel(data, question, request, conditionalHtml)
  const reachedCheckDetails = getYarValue(request, 'reachedCheckDetails')

  if (reachedCheckDetails) {
    MODEL = {
      ...MODEL,
      reachedCheckDetails
    }
  }
  return MODEL
}
const getPage = async (question, request, h) => {
  const { url, backUrlObject, dependantNextUrl, type, title, yarKey, preValidationObject, replace } = question
  let backUrl = getUrl(backUrlObject, question.backUrl, request)
  const nextUrl = getUrl(dependantNextUrl, question.nextUrl, request)
  const isRedirect = guardPage(request, preValidationObject)
  if (isRedirect) {
    return h.redirect(startPageUrl)
  }
  let confirmationId = ''

  if (url === 'remove-item') {
    const queryParams = new URLSearchParams(request.raw.req.url.split('?')[1])
    setYarValue(request, 'confirmItem', queryParams.get('item'))
    setYarValue(request, 'index', queryParams.get('index'))
  }

  if (url === 'item-conditional') {
    if (getYarValue(request, 'projectItemsList')?.length === 1) {
      backUrl = `${urlPrefix}/other-item`
    } else {
      backUrl = `${urlPrefix}/project-items-summary`
    }
  }

  if (question.maybeEligible) {
    let { maybeEligibleContent } = question
    maybeEligibleContent.title = question.title
    let consentOptionalData

    if (maybeEligibleContent.reference) {
      if (!getYarValue(request, 'consentMain')) {
        return h.redirect(startPageUrl)
      }
      confirmationId = getConfirmationId(request.yar.id, getYarValue(request, 'projectSubject'))
      try {
        const overAllScore = getYarValue(request, 'overAllScore')
        const emailData = await emailFormatting({ body: createMsg.getAllDetails(request, confirmationId), overAllScore, correlationId: request.yar.id })
        await senders.sendDesirabilitySubmitted(emailData, request.yar.id)
        await gapiService.sendDimensionOrMetrics(request, [{
          dimensionOrMetric: gapiService.dimensions.CONFIRMATION,
          value: confirmationId
        }, {
          dimensionOrMetric: gapiService.dimensions.FINALSCORE,
          value: 'Eligible'
        },
        {
          dimensionOrMetric: gapiService.metrics.CONFIRMATION,
          value: 'TIME'
        }
        ])
        console.log('Confirmation event sent')
      } catch (err) {
        console.log('ERROR: ', err)
      }
      maybeEligibleContent = {
        ...maybeEligibleContent,
        reference: {
          ...maybeEligibleContent.reference,
          html: maybeEligibleContent.reference.html.replace(
            SELECT_VARIABLE_TO_REPLACE, (_ignore, confirmatnId) => (
              confirmationId
            )
          )
        }
      }

      if (getYarValue(request, 'projectSubject') === 'Solar project items') {
        maybeEligibleContent.additionalParagraph = maybeEligibleContent.messageContentPartSolar
      } else {
        maybeEligibleContent.additionalParagraph = maybeEligibleContent.messageContentPartRobotics
      }
      maybeEligibleContent.messageContent = maybeEligibleContent.messageContentBeforeConditional + maybeEligibleContent.additionalParagraph + maybeEligibleContent.messageContentPostConditional
      request.yar.reset()
    }

    maybeEligibleContent = {
      ...maybeEligibleContent,
      messageContent: maybeEligibleContent.messageContent.replace(
        SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
          formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
        )
      )
    }

    if (url === 'confirm') {
      const consentOptional = getYarValue(request, 'consentOptional')
      consentOptionalData = {
        hiddenInput: {
          id: 'consentMain',
          name: 'consentMain',
          value: 'true',
          type: 'hidden'
        },
        idPrefix: 'consentOptional',
        name: 'consentOptional',
        items: setOptionsLabel(consentOptional,
          [{
            value: 'CONSENT_OPTIONAL',
            text: '(Optional) I confirm'
          }]
        )
      }
    }

    const MAYBE_ELIGIBLE = { ...maybeEligibleContent, consentOptionalData, url, nextUrl, backUrl }
    return h.view('maybe-eligible', MAYBE_ELIGIBLE)
  }

  if (title) {
    question = {
      ...question,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
  }

  if (replace) {
    if (getYarValue(request, 'technologyItems') === getQuestionAnswer('technology-items', 'technology-items-A9') && url === 'robotic-automatic') {
      question = {
        ...question,
        title: 'Is the other technology robotic or automatic?'
      }
    } else if (getYarValue(request, 'technologyItems') === getQuestionAnswer('technology-items', 'technology-items-A9')) {
      if (url === 'automatic-eligibility') {
        question = {
          ...question,
          title: 'Which eligibility criteria does your automatic technology meet?'
        }
      } else {
        question = {
          ...question,
          title: 'Does your robotic technology fit the eligibility criteria?'
        }
      }
    } else {
      question = {
        ...question,
        title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) =>
          getYarValue(request, additionalYarKeyName).toLowerCase()
        )
      }
    }
  }
  const data = getYarValue(request, yarKey) || null
  let conditionalHtml
  // if (question?.conditionalKey && question?.conditionalLabelData) {
  //   const conditional = question.conditionalKey
  //   conditionalHtml = handleConditinalHtmlData(
  //     type,
  //     question.conditionalLabelData,
  //     conditional,
  //     request
  //   )
  // }
  if (question.ga) {
    await gapiService.processGA(request, question.ga, confirmationId)
  }
  if (url === 'check-details') {
    setYarValue(request, 'reachedCheckDetails', true)
    const applying = getYarValue(request, 'applying')
    const applicant = getYarValue(request, 'applicant')
    const businessDetails = getYarValue(request, 'businessDetails')
    const agentDetails = getYarValue(request, 'agentsDetails')
    const isContractor = applicant === 'Contractor'
    const contractorDetails = isContractor ? getYarValue(request, 'contractorsDetails') : null
    const farmerDetails = isContractor ? null : getYarValue(request, 'farmerDetails')

    const agentContact = saveValuesToArray(agentDetails, ['emailAddress', 'mobileNumber', 'landlineNumber'])
    const agentAddress = saveValuesToArray(agentDetails, ['address1', 'address2', 'town', 'county', 'postcode'])

    const contractorContact = saveValuesToArray(contractorDetails, ['emailAddress', 'mobileNumber', 'landlineNumber'])
    const contractorAddress = saveValuesToArray(contractorDetails, ['address1', 'address2', 'town', 'county', 'postcode'])

    const farmerContact = saveValuesToArray(farmerDetails, ['emailAddress', 'mobileNumber', 'landlineNumber'])
    const farmerAddress = saveValuesToArray(farmerDetails, ['address1', 'address2', 'town', 'county', 'postcode'])
    const MODEL = {
      ...question.pageData,
      backUrl,
      nextUrl,
      applying,
      businessDetails,
      farmerDetails: {
        ...farmerDetails,
        ...(farmerDetails
          ? {
              name: `${farmerDetails.firstName} ${farmerDetails.lastName}`,
              contact: farmerContact.join('<br/>'),
              address: farmerAddress.join('<br/>')
            }
          : {}
        )
      },
      agentDetails: {
        ...agentDetails,
        ...(agentDetails
          ? {
              name: `${agentDetails.firstName} ${agentDetails.lastName}`,
              contact: agentContact.join('<br/>'),
              address: agentAddress.join('<br/>')
            }
          : {}
        )
      },
      contractorDetails: {
        ...contractorDetails,
        ...(contractorDetails
          ? {
              name: `${contractorDetails.firstName} ${contractorDetails.lastName}`,
              contact: contractorContact.join('<br/>'),
              address: contractorAddress.join('<br/>')
            }
          : {}
        )
      }

    }

    return h.view('check-details', MODEL)
  }
  switch (url) {
    case 'score':
    case 'business-details':
    case 'agents-details': {
      return h.view('page', getContractorFarmerModel(data, question, request, conditionalHtml))
    }
    case 'farmers-details': {
      return h.view('page', getContractorFarmerModel(data, question, request, conditionalHtml))
    }
    case 'contractors-details': {
      return h.view('page', getContractorFarmerModel(data, question, request, conditionalHtml))
    }
    case 'project-items-summary': {
      let projectItemsModel = getModel(data, question, request, conditionalHtml)
      const projectItemsList = getYarValue(request, 'projectItemsList')
      // if (projectItemsList.length > 1 ) {
      //   if(getYarValue(request, 'roboticEligibility') === 'No'){
      //     backUrl = `${urlPrefix}/robotic-eligibility`
      //       // return h.view('not-eligible', NOT_ELIGIBLE)
      //   }
      //   if([getYarValue(request, 'automaticEligibility')].flat().length < 2){
      //     backUrl = `${urlPrefix}/automatic-eligibility`
      //       // return h.view('not-eligible', NOT_ELIGIBLE)
      //   }
      // }
      projectItemsModel = {
        ...projectItemsModel,
        projectItemsList
      }
      return h.view('project-items-summary', projectItemsModel)
    }
    case 'legal-status':
      if (getYarValue(request, 'projectSubject') === 'Solar project items') {
        setYarValue(request, 'applicant', null)
      }
    default:
      break
  }

  const PAGE_MODEL = getModel(data, question, request, conditionalHtml)

  return h.view('page', PAGE_MODEL)
}

const showPostPage = (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl, dependantNextUrl, title, type, allFields, replace } = currentQuestion

  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload
  let thisAnswer
  let dataObject
  if (yarKey === 'consentOptional' && !Object.keys(payload).includes(yarKey)) {
    setYarValue(request, yarKey, '')
  }
  for (const [key, value] of Object.entries(payload)) {
    let payloadValue = value
    thisAnswer = answers?.find(answer => (answer.value === payloadValue))

    if (type !== 'multi-input' && key !== 'secBtn') {
      // payload.projectImpacts === 'Introduce acidification for the first time' && setYarValue(request, 'slurryCurrentlyTreated', 0)
      // payload.applying && resetYarValues(payload.applying, request)
      payloadValue = key === 'projectPostcode' ? payloadValue.replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase() : payloadValue
      setYarValue(request, key, payloadValue)
    }
  }
  if (type === 'multi-input') {
    allFields.forEach(field => {
      const payloadYarVal = payload[field.yarKey]
        ? payload[field.yarKey].replace(DELETE_POSTCODE_CHARS_REGEX, '').split(/(?=.{3}$)/).join(' ').toUpperCase()
        : ''
      dataObject = {
        ...dataObject,
        [field.yarKey]: (
          (field.yarKey === 'postcode' || field.yarKey === 'projectPostcode')
            ? payloadYarVal
            : payload[field.yarKey] || ''
        ),
        ...field.conditionalKey ? { [field.conditionalKey]: payload[field.conditionalKey] } : {}
      }
    })
    setYarValue(request, yarKey, dataObject)
  }
  if (title) {
    currentQuestion = {
      ...currentQuestion,
      title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) => (
        formatUKCurrency(getYarValue(request, additionalYarKeyName) || 0)
      ))
    }
  }
  if (replace) {
    if (getYarValue(request, 'technologyItems') === 'Other robotics or automatic technology' && baseUrl === 'robotic-automatic') {
      currentQuestion = {
        ...currentQuestion,
        title: 'Is the other technology robotic or automatic?',
        validate: [
          {
            type: 'NOT_EMPTY',
            error: 'Select if your other technology is robotic or automatic'
          }
        ]
      }
    } else {
      if (getYarValue(request, 'removeItem') === 'Yes' && baseUrl === 'remove-item') {
        getYarValue(request, 'projectItemsList')?.splice(getYarValue(request, 'index'), 1)
      }
      console.log('inside ELSE ----')
      currentQuestion = {
        ...currentQuestion,
        title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) =>
          getYarValue(request, additionalYarKeyName).toLowerCase()
        ),
        validate: [
          {
            type: 'NOT_EMPTY',
            error: currentQuestion.validate[0].error.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) =>
              getYarValue(request, additionalYarKeyName).toLowerCase()
            )
          }
        ]
      }
    }
  }
console.log('AFTER REPLACE ------')
  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    gapiService.sendValidationDimension(request)
    return errors
  }

  if (thisAnswer?.notEligible ||
      (yarKey === 'projectCost' ? !getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo).isEligible : null)
  ) {
    gapiService.sendEligibilityEvent(request, !!thisAnswer?.notEligible)

    // if (thisAnswer?.alsoMaybeEligible) {
    //   const {
    //     dependentQuestionKey,
    //     dependentQuestionYarKey,
    //     uniqueAnswer,
    //     notUniqueAnswer,
    //     maybeEligibleContent
    //   } = thisAnswer.alsoMaybeEligible

    //   const prevAnswer = getYarValue(request, dependentQuestionYarKey)

    //   const dependentQuestion = ALL_QUESTIONS.find(thisQuestion => (
    //     thisQuestion.key === dependentQuestionKey &&
    //     thisQuestion.yarKey === dependentQuestionYarKey
    //   ))

    //   let dependentAnswer
    //   let openMaybeEligible

    //   if (notUniqueAnswer) {
    //     dependentAnswer = dependentQuestion.answers.find(({ key }) => (key === notUniqueAnswer)).value
    //     openMaybeEligible = notUniqueSelection(prevAnswer, dependentAnswer)
    //   } else if (uniqueAnswer) {
    //     dependentAnswer = dependentQuestion.answers.find(({ key }) => (key === uniqueAnswer)).value
    //     openMaybeEligible = uniqueSelection(prevAnswer, dependentAnswer)
    //   }

    //   if (openMaybeEligible) {
    //     maybeEligibleContent.title = currentQuestion.title
    //     const { url } = currentQuestion
    //     const MAYBE_ELIGIBLE = { ...maybeEligibleContent, url, backUrl: baseUrl }
    //     return h.view('maybe-eligible', MAYBE_ELIGIBLE)
    //   }
    // }

    return h.view('not-eligible', NOT_ELIGIBLE)
  } else if (thisAnswer?.redirectUrl) {
    return h.redirect(thisAnswer?.redirectUrl)
  }

  if (yarKey === 'projectCost') {
    console.log('here?')
    const { calculatedGrant, remainingCost, projectCost } = getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo)
    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
    setYarValue(request, 'projectCost', projectCost)
    console.log(calculatedGrant, remainingCost, projectCost, 'calculatedGrant, remainingCost, projectCost')
  }
  switch (baseUrl) {
    case 'solar-technologies':
      if ([getYarValue(request, 'solarTechnologies')].flat().includes('Solar panels')) {
        return h.redirect(`${urlPrefix}/solar-installation`)
      } else {
        if (getYarValue(request, 'existingSolar') === 'Yes') {
          return h.redirect(`${urlPrefix}/project-cost-solar`)
        } else {
          return h.view('not-eligible', NOT_ELIGIBLE)
        }
      }
    case 'automatic-eligibility': {
      const automaticEligibilityAnswer = [getYarValue(request, 'automaticEligibility')].flat()
      if (automaticEligibilityAnswer.length === 1) {
        const projectItemsList = getYarValue(request, 'projectItemsList') ?? []
        if (projectItemsList.length <= 1) {
          NOT_ELIGIBLE.primaryBtn = {
            text: 'Add another item',
            url: `${urlPrefix}/technology-items`
          }
        } else {
          NOT_ELIGIBLE.primaryBtn = {
            text: 'Continue with eligible items',
            url: `${urlPrefix}/project-items-summary`
          }
          NOT_ELIGIBLE.secondaryBtn = {
            text: 'Add another item',
            url: `${urlPrefix}/technology-items`
          }
        }
        return h.view('not-eligible', NOT_ELIGIBLE)
      } else {
        return h.redirect(`${urlPrefix}/technology-description`)
      }
    }
    case 'robotic-eligibility': {
      const roboticEligibilityAnswer = getYarValue(request, 'roboticEligibility')

      if (roboticEligibilityAnswer === 'No') {
        const projectItemsList = getYarValue(request, 'projectItemsList') ?? []

        if (projectItemsList.length === 0) {
          NOT_ELIGIBLE.primaryBtn = {
            text: 'Add another item',
            url: `${urlPrefix}/technology-items`
          }
        } else {
          NOT_ELIGIBLE.primaryBtn = {
            text: 'Continue with eligible items',
            url: `${urlPrefix}/project-items-summary`
          }
          NOT_ELIGIBLE.secondaryBtn = {
            text: 'Add another item',
            url: `${urlPrefix}/technology-items`
          }
        }
        return h.view('not-eligible', NOT_ELIGIBLE)
      }
      else {
        return h.redirect(`${urlPrefix}/technology-description`)
      }
    }
    case 'technology-description': {
      const roboticArr = ['sensing system', 'makes decisions', 'control actuators', 'continuous loop']
      const roboticArrScore = ['Has sensing system that can understand its environment', 'Makes decisions and plans', 'Can control its actuators (the devices that move robotic joints)', 'Works in a continuous loop']
      let automaticFinalArr = []
      if (getYarValue(request, 'automaticEligibility')) {
        automaticFinalArr = getYarValue(request, 'automaticEligibility').map((item) => item.includes('sensing system') ? 'sensing system' : item.includes('Makes decisions') ? 'makes decisions' : item.includes('actuators') ? 'control actuators' : item.includes('continuous loop') ? 'continuous loop' : '')
      }
      const tempArray = getYarValue(request, 'projectItemsList') ?? []
      const tempObject = {
        index: tempArray.length + 1,
        item: getYarValue(request, 'technologyItems') === 'Other robotics or automatic technology' ? 'Other technology' : getYarValue(request, 'technologyItems'),
        type: getYarValue(request, 'roboticAutomatic'),
        criteria: getYarValue(request, 'automaticEligibility') ? automaticFinalArr : getYarValue(request, 'roboticEligibility') === 'Yes' ? roboticArr : null,
        criteriaScoring: getYarValue(request, 'automaticEligibility') ? getYarValue(request, 'automaticEligibility') : getYarValue(request, 'roboticEligibility') === 'Yes' ? roboticArrScore : null,
        description: getYarValue(request, 'technologyDescription').description
      }

      tempArray.push(tempObject)
      // reset all yars after item added
      setYarValue(request, 'technologyItems', null)
      setYarValue(request, 'roboticAutomatic', null)
      setYarValue(request, 'roboticEligibility', null)
      setYarValue(request, 'automaticEligibility', null)
      setYarValue(request, 'technologyDescription', null)

      // add item to projectItemsList
      setYarValue(request, 'projectItemsList', tempArray)
      break
    }
    case 'other-item': {
      if (getYarValue(request, 'projectItemsList')?.length === 1) {
        return h.redirect(`${urlPrefix}/item-conditional`)
      } else {
        return h.redirect(`${urlPrefix}/project-items-summary`)
      }
    }
    // case 'remove-item': {
    //   if(getYarValue(request, 'projectItemsList').length < 1 ){
    //     return h.redirect(`${urlPrefix}/robotic-automatic`)
    //   }
    // }
    default:
      break
  }
  return h.redirect(getUrl(dependantNextUrl, nextUrl, request, payload.secBtn))
}

const getHandler = (question) => {
  return (request, h) => {
    return getPage(question, request, h)
  }
}

const getPostHandler = (currentQuestion) => {
  return (request, h) => {
    return showPostPage(currentQuestion, request, h)
  }
}

module.exports = {
  getHandler,
  getPostHandler
}
