describe('Get & Post Handlers', () => {
  const varList = { businessDetails: 'randomData' }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (varList[key]) return varList[key]
      else return 'mock-yar-value'
    }
  }))

  jest.mock('../../../../app/helpers/conditionalHTML')
  const { getHtml } = require('../../../../app/helpers/conditionalHTML')

  jest.mock('../../../../app/helpers/models')
  const { getModel } = require('../../../../app/helpers/models')

  const {
    customiseErrorText
  } = require('../../../../app/helpers/errorSummaryHandlers')

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

  test('check technologyDescription()', () => {
    mockH = { view: jest.fn() }
    varList.technologyItems = 'Weeding technology'
    varList.roboticAutomatic = 'Robotic'
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'technologyDescription',
      type: 'multi-input',
      conditionalKey: 'mock-condKey',
      title: '{{_technologyItems_}}'
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
  })

  test('check technologyDescription() - other robotic', () => {
    mockH = { view: jest.fn() }
    varList.technologyItems = 'Other robotics or automatic technology'
    varList.roboticAutomatic = 'Robotic'
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'technologyDescription',
      type: 'multi-input',
      conditionalKey: 'mock-condKey',
      title: '{{_technologyItems_}}'
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
  })

  test('check technologyDescription() - other automatic', () => {
    mockH = { view: jest.fn() }
    varList.technologyItems = 'Other robotics or automatic technology'
    varList.roboticAutomatic = 'Automatic'
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'technologyDescription',
      type: 'multi-input',
      conditionalKey: 'mock-condKey',
      title: '{{_technologyItems_}}'
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
  })

  test('check technologyDescription() - not robotic or automatic', () => {
    mockH = { view: jest.fn() }
    varList.technologyItems = 'Other robotics or automatic technology'
    varList.roboticAutomatic = 'hello'
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'technologyDescription',
      type: 'multi-input',
      conditionalKey: 'mock-condKey',
      title: '{{_technologyItems_}}'
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
  })

  test('check technologyItems() - Farmer', () => {
    mockH = { view: jest.fn() }
    varList.applicant = 'Farmer'
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'technologyItems',
      type: 'multi-input',
      conditionalKey: 'mock-condKey',
      title: '{{_technologyItems_}}'
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
  })

  test('check technologyItems() - Contractor, tenancy - Yes', () => {
    mockH = { view: jest.fn() }
    varList.applicant = 'Contractor'
    varList.tenancy = 'Yes'
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'technologyItems',
      type: 'multi-input',
      conditionalKey: 'mock-condKey',
      answers: [
        { value: 'mock-value', contractorOnly: true},
        { value: 'mock-value2', contractorOnly: false}]
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
  })

  test('check technologyItems() - Contractor, tenancy - No', () => {
    mockH = { view: jest.fn() }
    varList.applicant = 'Contractor'
    varList.tenancy = 'No'
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

   
    let currentQuestion = {
      yarKey: 'technologyItems',
      type: 'multi-input',
      conditionalKey: 'mock-condKey',
      answers: [
        { value: 'mock-value', contractorOnly: true},
        { value: 'mock-value2', contractorOnly: false}]
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
  })

  test('check roboticEligibility()', () => {
    mockH = { view: jest.fn() }
    varList.technologyItems = 'Weeding technology'
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'roboticEligibility',
      type: 'multi-input',
      conditionalKey: 'mock-condKey',
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
  })

  test('check roboticEligibility() - robotic only', () => {
    mockH = { view: jest.fn() }
    varList.technologyItems = 'Slurry robots'
    getHtml.mockReturnValue('mock-html')
    getModel.mockReturnValue({ items: ['item1', 'item2'] })

    let currentQuestion = {
      yarKey: 'roboticEligibility',
      type: 'multi-input',
      conditionalKey: 'mock-condKey',
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
  })
})
