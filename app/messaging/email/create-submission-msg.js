const emailConfig = require('./config/email')
const spreadsheetConfig = require('./config/spreadsheet')
const { getQuestionAnswer } = require('../../helpers/utils')

const PROJECT_SUBJECT_SOLAR = getQuestionAnswer('project-subject', 'project-subject-A2')

function getQuestionScoreBand (questions, questionKey) {
  const result = questions.find(question => question.key === questionKey)
  if (!result) {
    throw new Error(`Question ${questionKey} not found`)
  }
  return result.rating.band
}

function generateRow (rowNumber, name, value, bold = false) {
  return {
    row: rowNumber,
    values: ['', name, value],
    bold
  }
}

// function getProjectItems (projectItems, infrastructure, roboticTechnology, technologyItems) {
//   projectItems = [projectItems].flat()
//   if (infrastructure === 'Acidification infrastructure') {
//     projectItems.push(infrastructure.toLowerCase())
//   } else {
//     if (technologyItems) {
//       technologyItems = [technologyItems].flat()
//       projectItems = [...projectItems, ...technologyItems]
//     }
//     if (roboticTechnology) {
//       projectItems.push(roboticTechnology)
//     }
//   }
//   return projectItems.join('|')
// }

function calculateBusinessSize (employees, turnover) {
  const employeesNum = Number(employees)
  const turnoverNum = Number(turnover)

  if (employeesNum < 10 && turnoverNum < 1740000) { // €2m turnover
    return 'Micro'
  } else if (employeesNum < 50 && turnoverNum < 8680000) { // €10m turnover
    return 'Small'
  } else if (employeesNum < 250 && turnoverNum < 43410000) { // €50m turnover
    return 'Medium'
  } else {
    return 'Large'
  }
}

function addAgentDetails (agentsDetails) {
  return [
    generateRow(26, 'Agent Surname', agentsDetails?.lastName ?? ''),
    generateRow(27, 'Agent Forename', agentsDetails?.firstName ?? ''),
    generateRow(29, 'Agent Address line 1', agentsDetails?.address1 ?? ''),
    generateRow(30, 'Agent Address line 2', agentsDetails?.address2 ?? ''),
    generateRow(31, 'Agent Address line 3', ''),
    generateRow(32, 'Agent Address line 4 (town)', agentsDetails?.town ?? ''),
    generateRow(33, 'Agent Address line 5 (County)', agentsDetails?.county ?? ''),
    generateRow(34, 'Agent Postcode (use capitals)', agentsDetails?.postcode ?? ''),
    generateRow(35, 'Agent Landline number', agentsDetails?.landlineNumber ?? ''),
    generateRow(36, 'Agent Mobile number', agentsDetails?.mobileNumber ?? ''),
    generateRow(37, 'Agent Email', agentsDetails?.emailAddress ?? ''),
    generateRow(28, 'Agent Business Name', agentsDetails?.businessName ?? '')
  ]
}

function generateExcelFilename (scheme, projectName, businessName, referenceNumber, today) {
  const dateTime = new Intl.DateTimeFormat('en-GB', {
    timeStyle: 'short',
    dateStyle: 'short',
    timeZone: 'Europe/London'
  }).format(today).replace(/\//g, '-')
  return `${scheme}_${projectName}_${businessName}_${referenceNumber}_${dateTime}.xlsx`
}

function formatProjectItems (projectItemsList, normalItems) {
// format list of project items for excel
  const projectItems = []

  if (normalItems.includes(getQuestionAnswer('project-items', 'project-items-A1'))) {
    projectItems.push(getQuestionAnswer('project-items', 'project-items-A1'))
  }

  if (normalItems.includes(getQuestionAnswer('project-items', 'project-items-A2'))) {
    projectItems.push(getQuestionAnswer('project-items', 'project-items-A2'))
  }

  if (normalItems.includes(getQuestionAnswer('project-items', 'project-items-A3'))) {

    for (i = 0; i < projectItemsList.length; i++) {
      projectItems.push(`${projectItemsList[i].item} ~ ${projectItemsList[i].type} ~ ${projectItemsList[i].criteria.join(', ')}`)
    
    }
  }
  
  return projectItems.join('|')

}

function formatDescriptions(projectItemsList) {

  const descriptionList = []

  for (i = 0; i < projectItemsList.length; i++) {
    descriptionList.push(`${projectItemsList[i].item} ~ ${projectItemsList[i].type} ~ ${projectItemsList[i].criteria.join(', ')} ~ ${projectItemsList[i].itemName} ${projectItemsList[i].brand && ("~ " + projectItemsList[i].brand)}${projectItemsList[i].model && (" ~ " + projectItemsList[i].model)}${projectItemsList[i].numberOfItems && (" ~ " + projectItemsList[i].numberOfItems)}`)
  
  }
  
  return descriptionList.join('|')

}

const getPlanningPermissionDoraValue = (planningPermission) => {
  switch (planningPermission) {
    case 'Not needed':
      return 'Not needed'
    case 'Should be in place by the time I make my full application':
      return 'Applied for'
    default:
      return 'Approved'
  }
}

function getSpreadsheetDetails (submission, desirabilityScore) {
  const today = new Date()
  const todayStr = today.toLocaleDateString('en-GB')
  const schemeName = submission.projectSubject === PROJECT_SUBJECT_SOLAR ? 'Solar' : 'Robotics'
  const subScheme = `FTF-${schemeName}`
  const farmerContractorDetails = submission.farmerDetails ?? submission.contractorsDetails
  return {
    filename: generateExcelFilename(
      subScheme.trim(),
      submission.businessDetails.projectName.trim(),
      submission.businessDetails.businessName.trim(),
      submission.confirmationId.trim(),
      today
    ),
    uploadLocation: `Farming Investment Fund/Farming Transformation Fund/${spreadsheetConfig.uploadEnvironment}/Productivity/${schemeName}/`,
    worksheets: [
      {
        title: 'DORA DATA',
        ...(spreadsheetConfig.protectEnabled ? { protectPassword: spreadsheetConfig.protectPassword } : {}),
        hideEmptyRows: spreadsheetConfig.hideEmptyRows,
        defaultColumnWidth: 30,
        rows: [
          generateRow(1, 'Field Name', 'Field Value', true),
          generateRow(2, 'FA or OA', 'Outline Application'),
          generateRow(40, 'Scheme', 'Farming Transformation Fund'),
          generateRow(39, 'Sub scheme', 'FTF-Productivity Round 2'),
          generateRow(43, 'Theme', 'Robotics, automation and solar'),
          generateRow(90, 'Project type', submission.projectSubject),
          generateRow(41, 'Owner', 'RD'),
          generateRow(341, 'Grant Launch Date', (new Date('2024-01-08')).toLocaleDateString('en-GB')),
          generateRow(385, 'Applicant Type', submission.applicant),
          
          generateRow(23, 'Status of applicant', submission.legalStatus),
          generateRow(45, 'Applicant Business or Project Postcode', farmerContractorDetails.projectPostcode ?? farmerContractorDetails.postcode),
          generateRow(376, 'Project Started', submission.projectStart),
          generateRow(342, 'Land owned by Farm', submission.tenancy ?? ''),

          // robotics project items
          generateRow(464, 'Project Responsibility', submission.tenancy === getQuestionAnswer('tenancy', 'tenancy-A2') ? submission.projectResponsibility : 'N/A'),
          generateRow(44, 'Project Items', submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A1') ? formatProjectItems(submission.projectItemsList, submission.projectItems) : 'N/A'),
          generateRow(474, 'Technology Description', submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A1') ? formatDescriptions(submission.projectItemsList) : 'N/A'), 
          generateRow(472, 'Improve Productivity', submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A1') ? submission.projectImpact : 'N/A'),

          generateRow(468, 'Existing Solar PV System', submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A2') ? submission.existingSolar : 'N/A'),
          generateRow(469, 'Solar PV Panel Location',  submission.solarTechnologies?.includes(getQuestionAnswer('solar-technologies', 'solar-technologies-A2')) ? submission.solarInstallation : 'N/A'),

          generateRow(55, 'Total project expenditure', String(submission.projectCost).replace(/,/g, '')),
          generateRow(57, 'Grant rate', submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A1') ? '40' : '25'),
          generateRow(56, 'Grant amount requested', submission.calculatedGrant),
          generateRow(345, 'Remaining Cost to Farmer', submission.remainingCost),
          generateRow(346, 'Planning Permission Status', getPlanningPermissionDoraValue(submission.planningPermission)),

          generateRow(378, 'Data Analytics', submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A1') ? submission.dataAnalytics : 'N/A'),
          generateRow(379, 'Electricity Source', submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A1') ? [submission.energySource].flat().join('|') : 'N/A'),
          generateRow(380, 'Agricultural Sector', [submission.agriculturalSector].flat().join('|') ?? ''),
          generateRow(381, 'Currently Technology Usage', submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A1') ? submission.technologyUse : 'N/A'),
          generateRow(473, 'Labour Replaced', submission.projectItems?.includes(getQuestionAnswer('project-items', 'project-items-A3')) ? submission.labourReplaced : 'N/A'),

          generateRow(470, 'Solar Technology', submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A2') ? submission.solarTechnologies : 'N/A'),
          generateRow(471, 'Solar PV System Output', submission.solarTechnologies?.includes(getQuestionAnswer('solar-technologies', 'solar-technologies-A2')) ? submission.solarOutput : 'N/A'),

          generateRow(365, 'OA score', desirabilityScore.desirability.overallRating.band),
          generateRow(366, 'Date of OA decision', ''),
          generateRow(42, 'Project name', submission.businessDetails.projectName),
          generateRow(4, 'Single business identifier (SBI)', submission.businessDetails.sbi || '000000000'), // sbi is '' if not set so use || instead of ??
          generateRow(7, 'Business name', submission.businessDetails.businessName),
          generateRow(367, 'Annual Turnover', submission.businessDetails.businessTurnover),
          generateRow(22, 'Employees', submission.businessDetails.numberEmployees),
          generateRow(20, 'Business size', calculateBusinessSize(submission.businessDetails.numberEmployees, submission.businessDetails.businessTurnover)),

          generateRow(91, 'Are you an AGENT applying on behalf of your customer', submission.applying === 'Agent' ? 'Yes' : 'No'),
          generateRow(5, 'Surname', farmerContractorDetails.lastName),
          generateRow(6, 'Forename', farmerContractorDetails.firstName),
          generateRow(8, 'Address line 1', farmerContractorDetails.address1),
          generateRow(9, 'Address line 2', farmerContractorDetails.address2),

          generateRow(11, 'Address line 4 (town)', farmerContractorDetails.town),
          generateRow(12, 'Address line 5 (county)', farmerContractorDetails.county),
          generateRow(13, 'Postcode (use capitals)', farmerContractorDetails.postcode),
          generateRow(16, 'Landline number', farmerContractorDetails.landlineNumber ?? ''),
          generateRow(17, 'Mobile number', farmerContractorDetails.mobileNumber ?? ''),
          generateRow(18, 'Email', farmerContractorDetails.emailAddress),
          generateRow(89, 'Customer Marketing Indicator', submission.consentOptional ? 'Yes' : 'No'),
          generateRow(368, 'Date ready for QC or decision', todayStr),
          generateRow(369, 'Eligibility Reference No.', submission.confirmationId),
          generateRow(94, 'Current location of file', 'NA Automated'),
          generateRow(92, 'RAG rating', 'Green'),
          generateRow(93, 'RAG date reviewed ', todayStr),
          generateRow(54, 'Electronic OA received date ', todayStr),
          generateRow(370, 'Status', 'Pending RPA review'),
          generateRow(85, 'Full Application Submission Date', '31/10/2024'),
          generateRow(375, 'OA percent', String(( desirabilityScore.desirability.overallRating.score / (submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A1') ? 600 : 300) * 100).toFixed(2))), // calculate percentage for robotics or solar based on project
          ...addAgentDetails(submission.agentsDetails)
        ]
      }
    ]
  }
}

function getCurrencyFormat (amount) {
  return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, style: 'currency', currency: 'GBP' })
}

function getScoreChance (rating) {
  switch (rating.toLowerCase()) {
    case 'strong':
      return 'seems likely to'
    case 'average':
      return 'might'
    default:
      return 'seems unlikely to'
  }
}

function displayObject (projectItemsList) {
  const descriptionList = []

  for (i = 0; i < projectItemsList.length; i++) {
    descriptionList.push(`${projectItemsList[i].item} ~ ${projectItemsList[i].type} ~ ${projectItemsList[i].criteria.join(', ')} ~ ${projectItemsList[i].itemName} ~ ${projectItemsList[i].brand} ~ ${projectItemsList[i].model} ~ ${projectItemsList[i].numberOfItems}`) // here
  
  }
  
  return descriptionList.join('\n')

}
function getEmailDetails (submission, desirabilityScore, rpaEmail, isAgentEmail = false) {
  const farmerContractorDetails = submission.farmerDetails ?? submission.contractorsDetails
  const email = isAgentEmail ? submission.agentsDetails.emailAddress : farmerContractorDetails.emailAddress  
  return {
    notifyTemplate: emailConfig.notifyTemplate,
    emailAddress: rpaEmail || email,
    details: {
      firstName: isAgentEmail ? submission.agentsDetails.firstName : farmerContractorDetails.firstName,
      lastName: isAgentEmail ? submission.agentsDetails.lastName : farmerContractorDetails.lastName,
      referenceNumber: submission.confirmationId,
      overallRating: desirabilityScore.desirability.overallRating.band,
      scoreChance: getScoreChance(desirabilityScore.desirability.overallRating.band),
      projectSubject: submission.projectSubject,
      isSolar: submission.projectSubject === PROJECT_SUBJECT_SOLAR,
      isRobotics: submission.projectSubject !== PROJECT_SUBJECT_SOLAR,
      isContractor: submission?.projectSubject !== PROJECT_SUBJECT_SOLAR && submission?.applicant === 'Contractor',
      isNotTenancy: submission.tenancy === getQuestionAnswer('tenancy', 'tenancy-A2'),
      legalStatus: submission.legalStatus ?? '',
      inEngland: submission.inEngland ?? '',
      businessLocation: submission?.businessLocation ?? '',
      location: `England ${farmerContractorDetails.projectPostcode ?? farmerContractorDetails.postcode}`,
      planningPermission: submission.planningPermission,
      projectStart: submission.projectStart,
      tenancy: submission.tenancy ?? '',
      isTenancyLength: submission.tenancyLength ? 'Yes' : 'No',
      tenancyLength: submission.tenancyLength ?? '',
      projectResponsibility: submission.projectResponsibility ?? '',
      projectItems: submission.projectItems ? [submission.projectItems].flat().join('\n') : '',
      technologyItems: submission.projectItemsList ? displayObject(submission.projectItemsList) : '', //here
      isTechnologyItems: submission.projectSubject !== PROJECT_SUBJECT_SOLAR && submission.projectItems?.includes(getQuestionAnswer('project-items', 'project-items-A3')),
      projectImpact: submission.projectImpact ?? '',
      existingSolar: submission.existingSolar ?? '',
      projectCost: getCurrencyFormat(submission.projectCost),
      potentialFunding: getCurrencyFormat(Number(submission.calculatedGrant)),
      remainingCost: getCurrencyFormat(submission.remainingCost),

      dataAnalytics: submission.dataAnalytics ?? '',
      dataAnalyticsScore: submission.dataAnalytics && submission.projectSubject !== PROJECT_SUBJECT_SOLAR ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'data-analytics') : '',

      energySource: submission.energySource ? [submission.energySource].flat().join(' | ') : '',
      energySourceScore: submission.projectSubject !== PROJECT_SUBJECT_SOLAR ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'energy-source') : '',

      agriculturalSectorRobotics: ( submission.agriculturalSector && submission.projectSubject !== PROJECT_SUBJECT_SOLAR ) ? [submission.agriculturalSector].flat().join(' | ') : '',
      agriculturalSectorRoboticsScore: submission.projectSubject !== PROJECT_SUBJECT_SOLAR ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'agricultural-sector') : '',

      technologyUse: submission.technologyUse ?? '',
      technologyUseScore: submission.projectSubject !== PROJECT_SUBJECT_SOLAR ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'technology-use') : '',

      labourReplaced:  submission?.labourReplaced ?? '',
      labourReplacedScore: submission.projectSubject !== PROJECT_SUBJECT_SOLAR ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'labour-replaced') : '',
      isLabourReplaced: submission.projectSubject !== PROJECT_SUBJECT_SOLAR && submission.projectItems?.includes(getQuestionAnswer('project-items', 'project-items-A3')),

      solarTechnologies: submission.solarTechnologies ? [submission.solarTechnologies].flat().join(' | ') : '',
      solarTechnologiesScore: submission.projectSubject === PROJECT_SUBJECT_SOLAR ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'solar-technologies') : '',

      isSolarPanels: submission.projectSubject === PROJECT_SUBJECT_SOLAR && submission.solarTechnologies?.includes(getQuestionAnswer('solar-technologies', 'solar-technologies-A2')),
      solarInstallation: submission.solarInstallation ?? '',

      solarOutput: submission.solarOutput ?? '',
      solarOutputScore: submission.projectSubject === PROJECT_SUBJECT_SOLAR && submission.solarTechnologies?.includes(getQuestionAnswer('solar-technologies', 'solar-technologies-A2')) ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'solar-output') : '',

      agriculturalSectorSolar: ( submission.agriculturalSector && submission.projectSubject === PROJECT_SUBJECT_SOLAR ) ? [submission.agriculturalSector].flat().join(' | ') : '',
      agriculturalSectorSolarScore: submission.projectSubject === PROJECT_SUBJECT_SOLAR ? getQuestionScoreBand(desirabilityScore.desirability.questions, 'agricultural-sector-solar') : '',

      grantRate: submission.projectSubject === getQuestionAnswer('project-subject', 'project-subject-A1') ? 'Up to 40%' : 'Up to 25%',

      projectName: submission.businessDetails.projectName,
      businessName: submission.businessDetails.businessName,
      isFarmer: submission.farmerDetails ? 'Yes' : 'No',
      farmerName: farmerContractorDetails.firstName,
      farmerSurname: farmerContractorDetails.lastName,
      farmerEmail: farmerContractorDetails.emailAddress,
      isAgent: submission.agentsDetails ? 'Yes' : 'No',
      agentName: submission.agentsDetails?.firstName ?? 'N/A',
      agentSurname: submission.agentsDetails?.lastName ?? '',
      agentBusinessName: submission.agentsDetails?.businessName ?? 'N/A',
      agentEmail: submission.agentsDetails?.emailAddress ?? 'N/A',
      contactConsent: submission.consentOptional ? 'Yes' : 'No',
      scoreDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
      farmerType: submission.applicant ?? ''
    }
  }
}
function spreadsheet (submission, desirabilityScore) {
  const data = getSpreadsheetDetails(submission, desirabilityScore)
  return data
}

module.exports = function (submission, desirabilityScore) {
  console.log('submission: ', submission)
  console.log('desirabilityScore: ', desirabilityScore)
  const emailDetails = getEmailDetails(submission, desirabilityScore, false)
  console.log('emailDetails: ', emailDetails)
  return {
    applicantEmail: emailDetails,
    agentEmail: submission.applying === 'Agent' ? getEmailDetails(submission, desirabilityScore, false, true) : null,
    rpaEmail: spreadsheetConfig.sendEmailToRpa ? getEmailDetails(submission, desirabilityScore, spreadsheetConfig.rpaEmail) : null,
    spreadsheet: spreadsheet(submission, desirabilityScore)
  }
}
