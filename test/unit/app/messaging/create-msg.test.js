describe('create-msg', () => {
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
  afterAll(() => {
    jest.resetAllMocks()
  })
  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')
  test('check getDesirabilityAnswers()', () => {
    mockVarList = {
      projectImpacts: 'hello',
      projectSubject: 'hello'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      projectImpacts: 'hello',
      projectSubject: 'hello'
    })
    mockVarList = {
      ...mockVarList,
      projectSubject: 'Robotics and Innovation',
      energySource: ['value'],
      agriculturalSector: ['value'],
      dataAnalytics: 'testing',
      technology: 'testing'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      projectSubject: 'Robotics and Innovation',
      projectImpacts: 'hello',
      energySource: ['value'],
      agriculturalSector: ['value'],
      dataAnalytics: 'testing',
      roboticProjectImpacts: 'testing'
    })
    mockVarList = {
      ...mockVarList,
      energySource: 'value',
      agriculturalSector: 'value'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      projectSubject: 'Robotics and Innovation',
      projectImpacts: 'hello',
      energySource: ['value'],
      agriculturalSector: ['value'],
      dataAnalytics: 'testing',
      roboticProjectImpacts: 'testing'
    })
    mockVarList = {
    }
    expect(getDesirabilityAnswers({})).toEqual(null)
  })
})
