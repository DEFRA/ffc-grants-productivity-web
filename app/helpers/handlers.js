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

// const resetYarValues = (applying, request) => {
//   setYarValue(request, 'agentsDetails', null)
//   setYarValue(request, 'contractorsDetails', null)
//   setYarValue(request, 'farmerDetails', null)
//   setYarValue(request, 'reachedCheckDetails', false)
// }

const getConfirmationId = (guid, journey) => {
  const prefix = journey.toLowerCase() === 'solar project items' ? 'S' : 'R'
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
  const { url, backUrlObject, dependantNextUrl, type, title, yarKey, replace } = question
  const preValidationObject = question.preValidationObject ?? question.preValidationKeys
  const backUrl = getUrl(backUrlObject, question.backUrl, request)
  const nextUrl = getUrl(dependantNextUrl, question.nextUrl, request)
  const isRedirect = guardPage(request, preValidationObject)
  if (isRedirect) {
    return h.redirect(startPageUrl)
  }
  let confirmationId = ''
  // if (url === 'item-conditional') {
  //   if (getYarValue(request, 'projectItemsList')?.length === 1) {
  //     backUrl = `${urlPrefix}/other-item`
  //   } else {
  //     backUrl = `${urlPrefix}/project-items-summary`
  //   }
  // }

  if (url === 'remove-item' && request.url.href.includes('?')) {
    const queryParams = new URLSearchParams(request.url.href.split('?')[1])

    setYarValue(request, 'confirmItem', queryParams.get('item'))
    setYarValue(request, 'index', queryParams.get('index'))

    return h.redirect('/productivity/remove-item')
  }

  if (url === 'technology-items') {
    // reset values if going back to this page from automatic-eligibility or robotic-eligibility if not eligible
    if (([getYarValue(request, 'automaticEligibility')].flat().length === 1 && ![getYarValue(request, 'automaticEligibility')].flat().includes(null)) || getYarValue(request, 'roboticEligibility') === 'No') {
      setYarValue(request, 'technologyItems', null)
      setYarValue(request, 'automaticEligibility', null)
      setYarValue(request, 'technologyDescription', null)
    }

    if (getYarValue(request, 'applicant') === 'Contractor') {
      question = {
        ...question,
        answers: question.answers.filter((option) => option.contractorOnly)
      }

      if (getYarValue(request, 'tenancy') === 'Yes') {
        question.backUrl = `${urlPrefix}/tenancy`
      } else {
        question.backUrl = `${urlPrefix}/project-responsibility`
      }
    }
  }

  await processGA(question, request)

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
      } catch (err) {
        console.error('ERROR: ', err)
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
            text: '(Optional) I consent to being contacted by Defra or a third party about service improvements'
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
    if (url === 'technology-description') {
      const techItem = getYarValue(request, 'technologyItems')
      if (techItem !== 'Other robotics or automatic technology') {
        const descriptionTitle = title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) =>
          getYarValue(request, additionalYarKeyName).toLowerCase()
        )
        question = {
          ...question,
          title: descriptionTitle
        }
      } else if (getYarValue(request, 'roboticAutomatic') === 'Robotic') {
        question = {
          ...question,
          title: 'Describe the robotic technology'
        }
      } else if (getYarValue(request, 'roboticAutomatic') === 'Automatic') {
        question = {
          ...question,
          title: 'Describe the automatic technology'
        }
      }
    }
  }

  if (replace) {
    if (getYarValue(request, 'technologyItems') === getQuestionAnswer('technology-items', 'technology-items-A9') && url === 'robotic-automatic') {
      question = {
        ...question,
        title: 'Is the other technology robotic or automatic?'
      }
    } else if (getYarValue(request, 'technologyItems') === getQuestionAnswer('technology-items', 'technology-items-A9') && url === 'automatic-eligibility') {
      question = {
        ...question,
        title: 'Which eligibility criteria does your automatic technology meet?'
      }
    } else if (getYarValue(request, 'technologyItems') === getQuestionAnswer('technology-items', 'technology-items-A9') && url === 'robotic-eligibility') {
      question = {
        ...question,
        title: 'Does your robotic technology fit the eligibility criteria?'
      }
    } else if (url === 'remove-item') {
      const index = getYarValue(request, 'index')
      const itemType = getYarValue(request, 'projectItemsList')[index].type
      if (getYarValue(request, 'confirmItem') === 'Other technology' && itemType === 'Automatic') {
        setYarValue(request, 'errorForRemove', 'the other automatic technology')
      } else if (getYarValue(request, 'confirmItem') === 'Other technology' && itemType === 'Robotic') {
        setYarValue(request, 'errorForRemove', 'the other robotic technology')
      } else {
        setYarValue(request, 'errorForRemove', getYarValue(request, 'confirmItem'))
      }
      question = {
        ...question,
        title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) =>
          getYarValue(request, additionalYarKeyName).toLowerCase()
        )
      }
    } else {
      question = {
        ...question,
        title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) =>
          getYarValue(request, additionalYarKeyName).toLowerCase()
        )
      }
    }
    if (url === 'robotic-eligibility') {
      const selectedOption = getYarValue(request, 'technologyItems')
      const shortListAnswers = ['technology-items-A4', 'technology-items-A5', 'technology-items-A6', 'technology-items-A7', 'technology-items-A8']
        .map((item) => getQuestionAnswer('technology-items', item))

      if (shortListAnswers.includes(selectedOption)) {
        question.backUrl = `${urlPrefix}/technology-items`
      }

      const title_dict = {
        'technology-items-A7': 'Do your feeding robots fit the eligibility criteria?',
        'technology-items-A8': 'Do your slurry robots fit the eligibility criteria?',
        'technology-items-A4': 'Does your driverless robotic tractor or platform fit the eligibility criteria?',
        'technology-items-A6': 'Does your voluntary robotic milking system fit the eligibility criteria?',
        'technology-items-A5': 'Does your robotic spraying technology fit the eligiblity criteria?'

      }

      Object.keys(title_dict).forEach((value) => {
        if (selectedOption === getQuestionAnswer('technology-items', value)) {
          question = {
            ...question,
            title: title_dict[value]
          }
        }
      })
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
    case 'agents-details': {
      if (getYarValue(request, 'projectSubject') === 'Solar project items') {
        question.dependantNextUrl.urlOptions.elseUrl = `${urlPrefix}/farmers-details`
      } else {
        question.dependantNextUrl.urlOptions.elseUrl = `${urlPrefix}/contractors-details`
      }
      return h.view('page', getContractorFarmerModel(data, question, request, conditionalHtml))
    }
    case 'business-details':
    case 'farmers-details': {
      return h.view('page', getContractorFarmerModel(data, question, request, conditionalHtml))
    }
    case 'contractors-details': {
      return h.view('page', getContractorFarmerModel(data, question, request, conditionalHtml))
    }
    case 'technology-items':
      setYarValue(request, 'backToItemsSummary', false)
      setYarValue(request, 'roboticAutomatic', null)
      setYarValue(request, 'roboticEligibility', null)
      break

    case 'project-items-summary': {
      const projectItemsList = getYarValue(request, 'projectItemsList')
      console.log('projectItemsList', projectItemsList)

      // back to project-items if reentering loop with items and not added a new item
      if (getYarValue(request, 'backToItemsSummary')) {
        question.backUrl = `${urlPrefix}/project-items`
      } else if (([getYarValue(request, 'automaticEligibility')].flat().length === 1 && ![getYarValue(request, 'automaticEligibility')].flat().includes(null)) || getYarValue(request, 'roboticEligibility') === 'No') {
        setYarValue(request, 'technologyItems', null)
        setYarValue(request, 'roboticAutomatic', null)
        setYarValue(request, 'automaticEligibility', null)
        setYarValue(request, 'roboticEligibility', null)
        setYarValue(request, 'technologyDescription', null)

        question.backUrl = `${urlPrefix}/technology-items`
      } else {
        question.backUrl = `${urlPrefix}/technology-description`
      }

      if (projectItemsList.length === 5) {
        question.showButton = false
      } else {
        question.showButton = true
      }

      if (projectItemsList?.length > 0 && question.backUrl !== `${urlPrefix}/technology-items`) {
        setYarValue(request, 'technologyItems', projectItemsList.at(-1).realItem)
        setYarValue(request, 'roboticAutomatic', projectItemsList.at(-1).type)
        setYarValue(request, 'roboticEligibility', projectItemsList.at(-1).type === 'Robotic' ? 'Yes' : null)
        setYarValue(request, 'automaticEligibility', projectItemsList.at(-1).type === 'Automatic' ? projectItemsList.at(-1).criteriaScoring : null)
        setYarValue(request, 'technologyDescription', {
          itemName: projectItemsList.at(-1).description.itemName,
          brand: projectItemsList.at(-1).description.brand,
          model: projectItemsList.at(-1).description.model,
          numberOfItems: projectItemsList.at(-1).description.numberOfItems
        })
      }

      setYarValue(request, 'removeItem', null)

      let projectItemsModel = getModel(data, question, request, conditionalHtml)
      projectItemsModel = {
        ...projectItemsModel,
        projectItemsList
      }
      return h.view('project-items-summary', projectItemsModel)
    }
    case 'energy-source':
      question.backUrl = true
    default:
      break
  }

  const PAGE_MODEL = getModel(data, question, request, conditionalHtml)
  return h.view('page', PAGE_MODEL)
}

const showPostPage = async (currentQuestion, request, h) => {
  const { yarKey, answers, baseUrl, ineligibleContent, nextUrl, dependantNextUrl, title, type, allFields, replace } = currentQuestion
  if (baseUrl !== 'score') {
    setYarValue(request, 'onScorePage', false)
  }
  const NOT_ELIGIBLE = { ...ineligibleContent, backUrl: baseUrl }
  const payload = request.payload
  let thisAnswer
  let dataObject
  if (yarKey === 'removeItem' && request?.payload?.item) {
    const { item, index } = request.payload
    setYarValue(request, 'confirmItem', item)
    setYarValue(request, 'index', index)

    return h.redirect(`${urlPrefix}/remove-item`)
  }

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

    if (yarKey === 'projectItems' && !value.includes(getQuestionAnswer('project-items', 'project-items-A3'))) {
      setYarValue(request, 'projectItemsList', [])
      setYarValue(request, 'labourReplaced', null)
      setYarValue(request, 'technologyItems', null)
      setYarValue(request, 'roboticAutomatic', null)
      setYarValue(request, 'roboticEligibility', null)
      setYarValue(request, 'automaticEligibility', null)
      setYarValue(request, 'technologyDescription', null)
      setYarValue(request, 'addToItemList', true)
    } else if (yarKey === 'solarTechnologies' && !value.includes(getQuestionAnswer('solar-technologies', 'solar-technologies-A2'))) {
      setYarValue(request, 'solarOutput', null)
      setYarValue(request, 'solarInstallation', null)
    } else if (yarKey === 'roboticAutomatic' && value === 'Robotic') {
      setYarValue(request, 'automaticEligibility', null)
    } else if (yarKey === 'roboticAutomatic' && value === 'Automatic') {
      setYarValue(request, 'roboticEligibility', null)
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
  if (title && (yarKey === 'remainingCosts' || yarKey === 'canPayRemainingCost')) {
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
        title: 'Is the other technology robotic or automatic?'
      }
    } else if (getYarValue(request, 'removeItem') === 'Yes' && baseUrl === 'remove-item') {
      {
        getYarValue(request, 'projectItemsList')?.splice(getYarValue(request, 'index'), 1)
      }
    } else if (baseUrl === 'automatic-eligibility') {
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
          },
          {
            type: 'STANDALONE_ANSWER',
            error: 'You cannot select that combination of options',
            standaloneObject: {
              questionKey: 'automatic-eligibility',
              answerKey: 'automatic-eligibility-A5'
            }
          }
        ]
      }
    } else {
      {
        currentQuestion = {
          ...currentQuestion,
          title: title.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) =>
            getYarValue(request, additionalYarKeyName)?.toLowerCase()
          ),
          validate: [
            {
              type: 'NOT_EMPTY',
              error: currentQuestion.validate[0].error.replace(SELECT_VARIABLE_TO_REPLACE, (_ignore, additionalYarKeyName) =>
                getYarValue(request, additionalYarKeyName)?.toLowerCase()
              )
            }
          ]
        }
      }
    }
  }
  const errors = checkErrors(payload, currentQuestion, h, request)
  if (errors) {
    gapiService.sendGAEvent(request, {
      name: gapiService.eventTypes.EXCEPTION,
      params: {
        errors: errors.length
      }
    })
    return errors
  }

  if (thisAnswer?.notEligible ||
    (yarKey === 'projectCost' ? !getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo).isEligible : null)
  ) {
    gapiService.sendGAEvent(request, {
      name: gapiService.eventTypes.ELIMINATION
    })

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
    // add if here to populate robotic-automatic
    if (yarKey === 'technologyItems') {
      setYarValue(request, 'roboticAutomatic', 'Robotic')
    }
    return h.redirect(thisAnswer?.redirectUrl)
  }

  if (yarKey === 'projectCost') {
    const { calculatedGrant, remainingCost, projectCost } = getGrantValues(payload[Object.keys(payload)[0]], currentQuestion.grantInfo)
    setYarValue(request, 'calculatedGrant', calculatedGrant)
    setYarValue(request, 'remainingCost', remainingCost)
    setYarValue(request, 'projectCost', projectCost)
  }

  const isSolar = getYarValue(request, 'projectSubject') === getQuestionAnswer('project-subject', 'project-subject-A2')
  const isContractor = getYarValue(request, 'applicant') === getQuestionAnswer('applicant', 'applicant-A2')
  switch (baseUrl) {
    case 'applicant': {
      if (isContractor && isSolar) {
        gapiService.sendGAEvent(request, {
          name: gapiService.eventTypes.ELIMINATION
        })
        return h.view('not-eligible', NOT_ELIGIBLE)
      }
      break
    }

    case 'tenancy': {
      if (isContractor && getYarValue(request, 'tenancy') === 'Yes') {
        return h.redirect(`${urlPrefix}/technology-items`)
      }
      break
    }

    case 'project-responsibility': {
      if (isContractor) {
        return h.redirect(`${urlPrefix}/technology-items`)
      }
      break
    }

    case 'project-subject':
      setYarValue(request, 'addToItemList', false)
      break

    case 'solar-technologies':
      if (payload.secBtn === 'Back to score') {
        break
      } else if ([getYarValue(request, 'solarTechnologies')].flat().includes('Solar PV panels')) {
        return h.redirect(`${urlPrefix}/solar-installation`)
      } else {
        if (getYarValue(request, 'existingSolar') === 'Yes') {
          return h.redirect(`${urlPrefix}/project-cost-solar`)
        } else {
          gapiService.sendGAEvent(request, {
            name: gapiService.eventTypes.ELIMINATION
          })
          return h.view('not-eligible', NOT_ELIGIBLE)
        }
      }

    case 'technology-items': {
      setYarValue(request, 'backToItemsSummary', false)
      break
    }

    case 'project-items':
      const projectItems = getYarValue(request, 'projectItemsList')
      if (projectItems?.length > 0 && getYarValue(request, 'projectItems')?.includes('Robotic and automatic technology')) {
        setYarValue(request, 'backToItemsSummary', true)
        return h.redirect(`${urlPrefix}/project-items-summary`)
      } else {
        setYarValue(request, 'backToItemsSummary', false)
      }
      break

    case 'automatic-eligibility': {
      const automaticEligibilityAnswer = [getYarValue(request, 'automaticEligibility')].flat()
      if (automaticEligibilityAnswer.length === 1 || automaticEligibilityAnswer.includes('None of the above')) {
        const projectItemsList = getYarValue(request, 'projectItemsList') ?? []
        if (projectItemsList.length === 0) {
          NOT_ELIGIBLE.primaryBtn = {
            text: 'Add another technology',
            url: `${urlPrefix}/technology-items`
          }
        } else {
          NOT_ELIGIBLE.primaryBtn = {
            text: 'Continue with eligible technology',
            url: `${urlPrefix}/project-items-summary`
          }
          NOT_ELIGIBLE.secondaryBtn = {
            text: 'Add another technology',
            url: `${urlPrefix}/technology-items`
          }
        }
        gapiService.sendGAEvent(request, {
          name: gapiService.eventTypes.ELIMINATION
        })
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
            text: 'Add another technology',
            url: `${urlPrefix}/technology-items`
          }
        } else {
          NOT_ELIGIBLE.primaryBtn = {
            text: 'Continue with eligible technology',
            url: `${urlPrefix}/project-items-summary`
          }
          NOT_ELIGIBLE.secondaryBtn = {
            text: 'Add another technology',
            url: `${urlPrefix}/technology-items`
          }
        }
        gapiService.sendGAEvent(request, {
          name: gapiService.eventTypes.ELIMINATION
        })
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
        type: getYarValue(request, 'roboticAutomatic') ?? getYarValue(request, 'roboticAutomatic'),
        criteria: getYarValue(request, 'automaticEligibility') ? automaticFinalArr : getYarValue(request, 'roboticEligibility') === 'Yes' ? roboticArr : null,
        criteriaScoring: getYarValue(request, 'automaticEligibility') ? getYarValue(request, 'automaticEligibility') : getYarValue(request, 'roboticEligibility') === 'Yes' ? roboticArrScore : null,
        description: getYarValue(request, 'technologyDescription') ?? getYarValue(request, 'technologyDescription'),
        realItem: getYarValue(request, 'technologyItems')
      }

      if (getYarValue(request, 'addToItemList') === true || tempArray.length === 0) {
        setYarValue(request, 'addToItemList', false)
        tempArray.push(tempObject)
        setYarValue(request, 'projectItemsList', tempArray)
      } else {
        tempArray[tempArray.length - 1] = tempObject
        setYarValue(request, 'projectItemsList', tempArray)
      } // else replace last item in projectItemsList with updated values

      break
    }

    case 'remove-item': {
      if (getYarValue(request, 'projectItemsList').length < 1) {
        setYarValue(request, 'technologyItems', null)
        setYarValue(request, 'roboticAutomatic', null)
        setYarValue(request, 'roboticEligibility', null)
        setYarValue(request, 'automaticEligibility', null)
        setYarValue(request, 'technologyDescription', null)
        setYarValue(request, 'addToItemList', true)
        return h.redirect(`${urlPrefix}/technology-items`)
      }
      break
    }

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

const processGA = async (question, request) => {
  if (question.ga) {
    if (question.ga.journeyStart) {
      setYarValue(request, 'journey-start-time', Date.now())
      console.log('[JOURNEY STARTED] ')
    } else {
      await gapiService.sendGAEvent(request, question.ga)
    }
  }
}

module.exports = {
  getHandler,
  getPostHandler
}
