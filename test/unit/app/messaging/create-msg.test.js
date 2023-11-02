describe('create-msg', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')

  test('check getDesirabilityAnswers() > robotics', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      projectSubject: 'Robotics and automatic technology',
      projectImpacts: 'value',
      energySource: ['value'],
      agriculturalSector: ['value'],
      dataAnalytics: 'testing',
      technology: 'testing'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      projectSubject: 'Robotics and automatic technology',
      projectImpacts: 'value',
      energySource: ['value'],
      agriculturalSectorRobotics: ['value'],
      dataAnalytics: 'testing',
      roboticProjectImpacts: 'testing'
    })

    dict = {
      ...dict,
      energySource: 'value',
      agriculturalSector: 'value'
    }

    expect(getDesirabilityAnswers({})).toEqual({
      projectSubject: 'Robotics and automatic technology',
      projectImpacts: 'value',
      energySource: ['value'],
      agriculturalSectorRobotics: ['value'],
      dataAnalytics: 'testing',
      roboticProjectImpacts: 'testing'
    })

  })

  test('check getDesirabilityAnswers() > solar', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      ...dict,
      projectSubject: 'Solar technologies',
      agriculturalSector: 'value',
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
      solarTechnologies: 'value',
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
