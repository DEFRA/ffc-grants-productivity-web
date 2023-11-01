const urlPrefix = require('../../../../app/config/server').urlPrefix
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
describe('getUrl()', () => {
  beforeEach(() => {
    mockVarList = {
      ...varListTemplate
    }
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  const { getUrl } = require('../../../../app/helpers/functions/urls')
  let urlObject = null
  let secBtn = 'Back to score'
  it('should return url if urlObject is empty', () => {
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual(
      `${urlPrefix}/score`
    )
    secBtn = ''
    expect(getUrl(urlObject, 'mock-url', {}, secBtn, '')).toEqual('mock-url')
  })
  it('should return elseUrl if urlObject and dependent Yar values are not present', () => {
    urlObject = {
      dependentQuestionYarKey: 'tenancy',
      dependentAnswerKeysArray: ['tenancy-A1'],
      urlOptions: {
        thenUrl: 'thenUrl',
        elseUrl: 'elseUrl'
      }
    }
    mockVarList = {
      tenancy: 'No'
    }
    const selectedURL = getUrl(urlObject, 'mock-url', {}, '', '')
    expect(selectedURL).toEqual('elseUrl')
  })
  it('should return thenUrl if urlObject and dependent Yar values are present', () => {
    urlObject = {
      dependentQuestionYarKey: ['tenancy'],
      dependentAnswerKeysArray: ['tenancy-A1'],
      urlOptions: {
        thenUrl: 'thenUrl',
        elseUrl: 'elseUrl'
      }
    }
    mockVarList = {
      tenancy: 'Yes'
    }
    expect(getUrl(urlObject, 'mock-url', {}, '', '')).toEqual('thenUrl')
  })

  it('should return the co-responding thenUrl if urlObject included more conditions', () => {
    urlObject = {
      dependentQuestionYarKey: ['tenancy', 'applicant', 'businessLocation'],
      dependentAnswerKeysArray: ['tenancy-A1', 'applicant-A2', 'business-location-A1'],
      urlOptions: {
        thenUrl: ['thenUrl', 'thenUrl2', 'thenUrl3'],
        elseUrl: 'elseUrl'
      }
    }
    mockVarList = {
      tenancy: 'Yes',
      applicant: 'Not The Answer We Are Looking For'
    }
    expect(getUrl(urlObject, 'mock-url', {}, '', '')).toEqual('thenUrl')
    mockVarList = {
      tenancy: 'Not an answer we are looking for',
      applicant: 'Contractor'
    }
    expect(getUrl(urlObject, 'mock-url', {}, '', '')).toEqual('thenUrl2')
    mockVarList = {
      businessLocation: 'Yes'
    }
    expect(getUrl(urlObject, 'mock-url', {}, '', '')).toEqual('thenUrl3')
  })
  it('should return secBtnPath if secBtn is "Back to score"', () => {
    urlObject = null
    mockVarList = {
      dependentQuestionYarKey: 'dependentAnswerKeysArray'
    }
    expect(getUrl(urlObject, 'mock-url', {}, 'Back to score', '')).toEqual(
      `${urlPrefix}/score`
    )
  })

  it('should default to /check-details if secBtn is not "Back to score" and current url is not a building or planning page', () => {
    urlObject = null
    mockVarList = {
      dependentQuestionYarKey: 'dependentAnswerKeysArray'
    }
    expect(
      getUrl(
        urlObject,
        'mock-url',
        {},
        'i-wish-i-was-writing-python',
        'or-even-java'
      )
    ).toEqual(`${urlPrefix}/check-details`)
  })
})
