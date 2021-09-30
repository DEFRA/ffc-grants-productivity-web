const { ALL_QUESTIONS } = require('../config/question-bank')

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
  return (question.answers.find(({ key }) => (key === answerKey)).value)
}

module.exports = {
  notUniqueSelection,
  uniqueSelection,
  getQuestionByKey,
  getQuestionAnswer
}
