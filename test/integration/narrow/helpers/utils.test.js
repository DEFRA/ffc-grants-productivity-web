jest.mock('../../../../app/helpers/functions/session')
const { getYarValue } = require('../../../../app/helpers/functions/session')

describe('Utils', () => {
  test('notUniqueSelection', () => {
    const { notUniqueSelection } = require('../../../../app/helpers/utils')

    const option = 'option'
    let answers = 'answers'
    expect(notUniqueSelection(answers, option)).toBeFalsy

    answers = 'stringIncludesoption'
    expect(notUniqueSelection(answers, option)).toBeFalsy

    answers = ['option']
    expect(notUniqueSelection(answers, option)).toBeFalsy

    answers = ['notOption', 'option']
    expect(notUniqueSelection(answers, option)).toBe(true)
  })

  test('uniqueSelection', () => {
    const { uniqueSelection } = require('../../../../app/helpers/utils')

    const option = 'option'
    let answers = 'answers'
    expect(uniqueSelection(answers, option)).toBeFalsy

    answers = 'stringIncludesoption'
    expect(uniqueSelection(answers, option)).toBe(true)

    answers = ['notOption', 'option']
    expect(uniqueSelection(answers, option)).toBe(false)

    answers = ['option']
    expect(uniqueSelection(answers, option)).toBeFalsy
  })

  xtest('getQuestionByKey', () => {
    const { ALL_QUESTIONS } = require('../../../../app/config/question-bank')
    const { getQuestionByKey } = require('../../../../app/helpers/utils')

    const containsKey = (searchKey) => (ALL_QUESTIONS.some(({ key }) => searchKey === key))

    expect(containsKey('fake-key')).toBe(false)
    expect(getQuestionByKey('fake-key')).toBeUndefined

    expect(containsKey('applicant-type')).toBe(true)
    expect(getQuestionByKey('applicant-type')).toBeDefined
    expect(getQuestionByKey('applicant-type')).toEqual(
      expect.objectContaining({
        key: 'applicant-type',
        baseUrl: 'applicant-type'
      })
    )
  })

  xtest('getQuestionAnswer', () => {
    const { getQuestionAnswer } = require('../../../../app/helpers/utils')
    expect(getQuestionAnswer('applicant-type', 'applicant-type-A1')).toBe('Pig')
  })

  xtest('allAnswersSelected', () => {
    const { allAnswersSelected } = require('../../../../app/helpers/utils')

    const mockAnswerList = ['applicant-type-A1', 'applicant-type-A2', 'applicant-type-A3']

    getYarValue.mockReturnValueOnce(['Pig', 'Beef'])
    getYarValue.mockReturnValueOnce(['Pig', 'Beef', 'Dairy'])

    expect(allAnswersSelected([], 'applicant-type', mockAnswerList)).toBe(false)
    expect(allAnswersSelected([], 'applicant-type', mockAnswerList)).toBe(true)
  })
})
