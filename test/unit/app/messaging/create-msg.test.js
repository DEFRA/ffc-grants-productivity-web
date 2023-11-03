describe('create-msg', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')

  test('check getDesirabilityAnswers() > robotics', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      projectSubject: 'Farm productivity project items',
      projectImpacts: 'value',
      energySource: ['value'],
      agriculturalSector: ['value'],
      dataAnalytics: 'testing',
      technology: 'testing'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      projectSubject: 'Farm productivity project items',
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
      projectSubject: 'Farm productivity project items',
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
      projectSubject: 'Solar project items',
      agriculturalSector: ['value'],
      solarTechnologies: ['value'],
      solarOutput: 'testing'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      projectSubject: 'Solar project items',
      agriculturalSectorSolar: ['value'],
      solarTechnologies: ['value'],
      solarOutput: 'testing'
    })

    dict = {
      ...dict,
      solarTechnologies: 'value',
      agriculturalSector: 'value',
      solarOutput: null

    }
    expect(getDesirabilityAnswers({})).toEqual({
      projectSubject: 'Solar project items',
      agriculturalSectorSolar: ['value'],
      solarTechnologies: ['value'],
      solarOutput: 'solar-output-A6'
    })

    dict = {
      ...dict,
      projectSubject: ''
    }
    expect(getDesirabilityAnswers({})).toEqual(null)
  })

})
