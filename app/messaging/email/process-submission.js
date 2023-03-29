const { sendDesirabilitySubmitted } = require('./../senders')
const createMsg = require('./create-submission-msg')
const appInsights = require('../../services/app-insights')

module.exports = async function (msg) {
  try {
    const { body: submissionDetails, correlationId, overallScore } = msg
    console.log('overAllScore - proc subb: ', overAllScore)
    console.log('correlationId - proc sub: ', correlationId)
    console.log(submissionDetails, 'MADE IT TO DETAILS')
    // Get details from cache regarding desirability score
    const msgOut = createMsg(submissionDetails, overallScore)

    return msgOut
  } catch (err) {
    console.error(`[ERROR][UNABLE TO PROCESS CONTACT DETAILS RECEIVER MESSAGE][${err}]`)
    appInsights.logException(err, msg?.correlationId)
  }
}
