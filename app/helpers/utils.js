const { ALL_QUESTIONS } = require('../config/question-bank')
const { getYarValue } = require('./session')

const answerContainsSelection = (answer, selection) => (
  (typeof (answer) === 'string' && answer === selection) ||
  (typeof (answer) === 'object' && answer.includes(selection))
)

const notUniqueSelection = (answers, option) => (
  answers?.includes(option) &&
    typeof (answers) === 'object' &&
    answers.length > 1
)

const uniqueSelection = (answers, option) => (
  answers?.includes(option) &&
    (typeof (answers) === 'string' ||
      (typeof (answers) === 'object' && answers.length === 1)
    )
)

const getQuestionByKey = (questionKey) => ALL_QUESTIONS.find(({ key }) => (key === questionKey))

const getQuestionAnswer = (questionKey, answerKey) => {
  const question = getQuestionByKey(questionKey)
  return (question.answers.find(({ key }) => (key === answerKey))?.value)
}

const allAnswersSelected = (request, questionKey, answerKeyList) => {
  const { yarKey, answers } = getQuestionByKey(questionKey)
  const yarValue = getYarValue(request, yarKey)
  return yarValue
    ? (
        answerKeyList.every(answerKey => (
          answers.some(({ key, value }) => (
            yarValue.includes(value) && key === answerKey
          ))
        ))
      )
    : false
}

module.exports = {
  answerContainsSelection,
  notUniqueSelection,
  uniqueSelection,
  getQuestionByKey,
  getQuestionAnswer,
  allAnswersSelected
}
