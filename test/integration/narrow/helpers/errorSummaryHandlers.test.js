const varListTemplate = {
  projectSubject: 'Slurry Acidification'
}
let mockVarList
jest.mock('grants-helpers', () => {
  const originalModule = jest.requireActual('grants-helpers')
  return {
    ...originalModule,
    setYarValue: (request, key, value) => {
      mockVarList[key] = value
    },
    getYarValue: (request, key) => {
      if (mockVarList[key]) return mockVarList[key]
      else return null
    }
  }
})
describe('Get & Post Handlers', () => {
  beforeEach(() => {
    mockVarList = {
      ...varListTemplate
    }
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  jest.mock('../../../../app/helpers/functions/conditionalHTML')
  const {
    getHtml
  } = require('../../../../app/helpers/functions/conditionalHTML')

  jest.mock('../../../../app/helpers/functions/models')
  const { getModel } = require('../../../../app/helpers/functions/models')

  const {
    customiseErrorText
  } = require('../../../../app/helpers/functions/errorSummaryHandlers')

  let mockH

  test('check customiseErrorText()', () => {
    mockH = { view: jest.fn() }
    // getYarValue.mockReturnValue('mock-yar-value')
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'mock-yarKey',
      type: 'multi-input',
      conditionalKey: 'mock-condKey'
    }
    let errorList = [{ href: 'mock-yarKey', text: 'mock-href-text' }]
    customiseErrorText('mock-value', currentQuestion, errorList, mockH, {})
    expect(mockH.view).toHaveBeenCalledWith(
      'page',
      {
        items: ['item1', 'item2'],
        errorList: [{
          href: 'mock-yarKey',
          text: 'mock-href-text'
        }]
      })

    getModel.mockReturnValue({ items: { item1: 'item1', item2: 'item2' } })
    currentQuestion = {
      ...currentQuestion,
      type: 'mock-type'
    }
    mockH.view.mockClear()
    customiseErrorText('mock-value', currentQuestion, errorList, mockH, {})
    expect(mockH.view).toHaveBeenCalledWith(
      'page',
      {
        items: {
          item1: 'item1',
          item2: 'item2',
          errorMessage: { text: 'mock-href-text' }
        },
        errorList: [{
          href: 'mock-yarKey',
          text: 'mock-href-text'
        }]
      }
    )

    getModel.mockReturnValue({ items: { item1: 'item1', item2: 'item2' } })
    errorList = [{ href: 'mock-another-yarKey', text: 'mock-another-href-text' }]
    mockH.view.mockClear()
    customiseErrorText('mock-value', currentQuestion, errorList, mockH, {})
    expect(mockH.view).toHaveBeenCalledWith(
      'page',
      {
        items: { item1: 'item1', item2: 'item2' },
        errorList: [{
          href: 'mock-another-yarKey',
          text: 'mock-another-href-text'
        }]
      }
    )
  })
})
