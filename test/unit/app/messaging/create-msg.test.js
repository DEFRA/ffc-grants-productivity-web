describe('create-msg', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')

  xtest('check getDesirabilityAnswers() > robotics', () => {
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
      projectSubject: 'Robotics and automatic technology',
      energySource: ['value'],
      agriculturalSector: ['value'],
      dataAnalytics: 'testing',
      technology: 'testing'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      projectImpacts: 'hello',
      projectSubject: 'hello'
    })

    dict = {
      ...dict,
      energySource: 'value',
      agriculturalSector: 'value'
    }

    expect(getDesirabilityAnswers({})).toEqual({
      projectSubject: 'Robotics and automatic technology',
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

  test('check getDesirabilityAnswers() > solar', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      ...dict,
      projectSubject: 'Solar technologies',
      agriculturalSector: ['value'],
      solarTechnologies: ['value'],
      solarOutput: 'testing'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      projectSubject: 'Solar technologies',
      agriculturalSectorSolar: ['value'],
      solarTechnologies: ['value'],
      solarOutput: 'testing'
    })

    dict = {
      ...dict,
      projectSubject: ''
    }
    expect(getDesirabilityAnswers({})).toEqual(null)
  })

})
