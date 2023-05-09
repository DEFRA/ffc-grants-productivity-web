describe('create-msg', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')

  test('check getDesirabilityAnswers()', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      projectImpacts: 'hello',
      projectSubject: 'hello'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      projectImpacts: 'hello',
      projectSubject: 'hello'
    })

    dict = {
      ...dict,
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

    dict = {
      ...dict,
      projectImpacts: ''
    }
    expect(getDesirabilityAnswers({})).toEqual(null)
  })
})
