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

module.exports = {
  notUniqueSelection,
  uniqueSelection
}
