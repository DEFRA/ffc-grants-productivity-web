const mockPassword = 'mock-pwd'
jest.mock('../../../../../app/messaging/email/config/spreadsheet', () => ({
  hideEmptyRows: true,
  protectEnabled: false,
  sendEmailToRpa: false,
  protectPassword: mockPassword
}))
jest.mock('../../../../../app/services/app-insights')
const processSubmission = require('../../../../../app/messaging/email/process-submission')
const cache = require('../../../../../app/config/cache')
cache.getDesirabilityScore = jest.fn(async (_correlationId) => { return null })
const appInsights = require('../../../../../app/services/app-insights')
appInsights.logException = jest.fn((_err, _sessionId) => { return null })

const projectDetailsReceiver = {
  completeMessage: jest.fn(async (_message) => { return null }),
  abandonMessage: jest.fn(async (_message) => { return null })
}
afterEach(() => {
  jest.clearAllMocks()
})
describe('get processSubmission setup defined', () => {
  test('Should be defined', () => {
    expect(processSubmission).toBeDefined()
  })
  test('Should be called', () => {
    expect(processSubmission('', projectDetailsReceiver)).toBeDefined()
  })

  test('Should be called with error', async () => {
    await expect(processSubmission(null, projectDetailsReceiver)).rejected
    expect(appInsights.logException).toHaveBeenCalledTimes(1)
  })
})
