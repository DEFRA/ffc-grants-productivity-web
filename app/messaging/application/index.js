const { sendMessage, receiveMessage } = require('../')
const { scoreRequestQueue, fetchScoreRequestMsgType, scoreResponseQueue } = require('../../config/messaging.js')

async function getProdScoring (data, sessionId) {
  console.log('[MADE IT TO MESSAGE]', sessionId)
  await sendMessage(data, fetchScoreRequestMsgType, scoreRequestQueue, { sessionId })

  console.log('[FINISHED SENDING MESSAGE MOVING TO RECEIVING]')
  return receiveMessage(sessionId, scoreResponseQueue)
}

module.exports = {
  getProdScoring
}
