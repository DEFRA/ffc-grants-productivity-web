describe('Create submission message', () => {
  const mockPassword = 'mock-pwd'

  jest.mock('../../../../../app/messaging/email/config/email', () => ({ notifyTemplate: 'mock-template' }))
  jest.mock('../../../../../app/messaging/email/config/spreadsheet', () => ({
    hideEmptyRows: true,
    protectEnabled: true,
    sendEmailToRpa: true,
    rpaEmail: 'FTF@rpa.gov.uk',
    protectPassword: mockPassword
  }))

  const desirabilityScore = require('./desirability-score.json')
  const createMsg = require('../../../../../app/messaging/email/create-submission-msg')

  beforeEach(() => {
    jest.resetModules()
  })

  test('Farmer submission generates correct message payload', () => {
    const farmerSubmission = require('./submission-farmer.json')
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.applicantEmail.emailAddress).toBe(farmerSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')
    expect(msg.agentEmail).toBe(null)
  })

  test('Farmer submission generates message payload without RPA email when config is Flase', () => {
    const farmerSubmission = require('./submission-farmer.json')
    const msg = createMsg(farmerSubmission, desirabilityScore)
    jest.mock('../../../../../app/messaging/email/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: false,
      sendEmailToRpa: false,
      protectPassword: mockPassword
    }))
    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.applicantEmail.emailAddress).toBe(farmerSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBeFalsy
    expect(msg.agentEmail).toBe(null)
  })

  test('Agent submission generates correct message payload - project items list', () => {
    const agentSubmission = require('./submission-agent.json')
    const msg = createMsg(agentSubmission, desirabilityScore)

    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.agentEmail.emailAddress).toBe(agentSubmission.agentsDetails.emailAddress)
    expect(msg.applicantEmail.emailAddress).toBe(agentSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')
  })

  test('Agent submission generates correct message payload - no project items list', () => {
    const agentSubmission = require('./submission-agent-nolist.json')
    const msg = createMsg(agentSubmission, desirabilityScore)

    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.agentEmail.emailAddress).toBe(agentSubmission.agentsDetails.emailAddress)
    expect(msg.applicantEmail.emailAddress).toBe(agentSubmission.farmerDetails.emailAddress)
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')
  })


  test('Email part of message should have correct properties', () => {
    const farmerSubmission = require('./submission-farmer.json')
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.applicantEmail).toHaveProperty('notifyTemplate')
    expect(msg.applicantEmail).toHaveProperty('emailAddress')
    expect(msg.applicantEmail).toHaveProperty('details')
    expect(msg.applicantEmail.details).toHaveProperty(
      'firstName', 'lastName', 'referenceNumber', 'overallRating', 'scoreChance', 'projectSubject', 'isSlurry', 'isRobotics'
      , 'legalStatus', 'location', 'planningPermission', 'projectStart', 'tenancy', 'tenancyLength', 'projectItems', 'projectCost'
      , 'potentialFunding', 'remainingCost', 'slurryCurrentlyTreated', 'slurryToBeTreated', 'projectImpacts', 'inEngland'
      , 'dataAnalytics', 'dataAnalyticsScore', 'energySourceScore', 'agriculturalSector', 'agriculturalSectorScore', 'technology', 'technologyScore'
      , 'projectName', 'businessName', 'farmerName', 'farmerSurname', 'farmerEmail', 'agentName', 'agentSurname', 'agentBusinessName', 'agentEmail', 'projectImpactsScore'
      , 'contactConsent', 'scoreDate'
    )
  })

  test('Spreadsheet part of message should have correct properties', () => {
    const agentSubmission = require('./submission-agent.json')
    const msg = createMsg(agentSubmission, desirabilityScore)

    expect(msg.spreadsheet).toHaveProperty('filename')
    expect(msg.spreadsheet).toHaveProperty('uploadLocation')
    expect(msg.spreadsheet).toHaveProperty('worksheets')
    expect(msg.spreadsheet.worksheets.length).toBe(1)
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('title')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('hideEmptyRows')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('defaultColumnWidth')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('protectPassword')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('rows')
    expect(msg.spreadsheet.worksheets[0].rows.length).toBe(72)
  })

  // test('Protect password property should not be set if config is false', () => {
  //   jest.mock('../../../app/config/spreadsheet', () => ({
  //     hideEmptyRows: true,
  //     protectEnabled: false,
  //     sendEmailToRpa: false,
  //     protectPassword: mockPassword
  //   }))
  //   const agentSubmission = require('./submission-agent.json')
  //   const createSubmissionMsg = require('../../../app/messaging/create-submission-msg')
  //   const msg = createSubmissionMsg(agentSubmission, desirabilityScore)
  //   expect(msg.spreadsheet.worksheets[0]).not.toHaveProperty('protectPassword')
  // })

  // test('Unknown farming type produces error string', () => {
  //   const farmerSubmission = require('./submission-farmer.json')
  //   farmerSubmission.farmingType = 'bad value'
  //   const msg = createMsg(farmerSubmission, desirabilityScore)

  //   expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 53).values[2]).toBe('Error: failed to map farming type')
  // })

  test('Under 10 employees results in micro business definition', () => {
    const farmerSubmission = require('./submission-farmer.json')
    farmerSubmission.businessDetails.numberEmployees = 1
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Micro')
  })

  test('Under 50 employees results in small business definition', () => {
    const farmerSubmission = require('./submission-farmer.json')
    farmerSubmission.businessDetails.numberEmployees = 10
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Small')
  })

  test('Under 250 employees results in medium business definition', () => {
    const farmerSubmission = require('./submission-farmer.json')
    farmerSubmission.businessDetails.numberEmployees = 50
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Medium')
  })

  test('Over 250 employees results in large business definition', () => {
    const farmerSubmission = require('./submission-farmer.json')
    farmerSubmission.businessDetails.numberEmployees = 250
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Large')
  })

  // it('formats item descriptions', () => {
  //   const farmerSubmission = require('./submission-farmer.json')
  //   farmerSubmission.projectItemsList = [
  //     {
  //       item: 'item1',
  //       type: 'type1',
  //       itemName: 'Actual name of the item',
  //       brand: 'brand1',
  //       model: 'model1',
  //       numberOfItems: '1',
  //       criteria: [
  //         "Criteria 1",
  //         "Criteria 2"
  //       ]
  //     },
  //     {
  //       item: 'item2',
  //       type: 'type2',
  //       itemName: 'Farming drone',
  //       brand: 'brand2',
  //       model: 'model2',
  //       numberOfItems: '2',
  //       criteria: [
  //         "Criteria 1",
  //         "Criteria 2"
  //       ]
  //     }
  //   ]
  //   farmerSubmission.projectItems = 'Robotic and automatic technology'
  //   let msg = createMsg(farmerSubmission, desirabilityScore)
  //   // solar
  //   expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 44).values[2]).toBe('N/A')
  //   expect(msg.applicantEmail.details.technologyItems).toBe(
  //     "item1 ~ type1 ~ Criteria 1, Criteria 2 ~ Actual name of the item ~ brand1 ~ model1 ~ 1\nitem2 ~ type2 ~ Criteria 1, Criteria 2 ~ Farming drone ~ brand2 ~ model2 ~ 2"
  //   )
  //   // robotics
  //   farmerSubmission.projectSubject = 'Farm productivity project items'
  //   msg = createMsg(farmerSubmission, desirabilityScore)
  //   expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 44).values[2]).toBe('item1 ~ type1 ~ Criteria 1, Criteria 2 ~ Actual name of the item ~ brand1 ~ model1 ~ 1|item2 ~ type2 ~ Criteria 1, Criteria 2 ~ Farming drone ~ brand2 ~ model2 ~ 2')
  //   expect(msg.applicantEmail.details.technologyItems).toBe(
  //     "item1 ~ type1 ~ Criteria 1, Criteria 2 ~ Actual name of the item ~ brand1 ~ model1 ~ 1\nitem2 ~ type2 ~ Criteria 1, Criteria 2 ~ Farming drone ~ brand2 ~ model2 ~ 2"
  //   )

  //   // optional brand, model and number of items are empty
  //   farmerSubmission.projectItemsList = [
  //     {
  //       item: 'item1',
  //       type: 'type1',
  //       itemName: 'some name',
  //       brand: '',
  //       model: '',
  //       numberOfItems: '',
  //       criteria: [
  //         "Criteria 1",
  //         "Criteria 2"
  //       ]
  //     }
  //   ]
  //   msg = createMsg(farmerSubmission, desirabilityScore)
  //   expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 44).values[2]).toBe('item1 ~ type1 ~ Criteria 1, Criteria 2 ~ some name')
  //   expect(msg.applicantEmail.details.technologyItems).toBe(
  //     "item1 ~ type1 ~ Criteria 1, Criteria 2 ~ some name"
  //   )
  // })
  it('should throw an error if a required key is missing', () => {
    const farmerSubmission = require('./submission-farmer.json')
    desirabilityScore.desirability.questions[0].key = 'some-other-key'
    expect(() => createMsg(farmerSubmission, desirabilityScore)).toThrow('Question solar-output not found')
  })
})
