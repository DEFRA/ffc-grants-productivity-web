describe('create-msg', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')

  test('check getDesirabilityAnswers() > robotics', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      projectSubject: 'Farm productivity project items',
      energySource: ['value'],
      agriculturalSector: ['value'],
      dataAnalytics: 'testing',
      technologyUse: 'testing',
      labourReplaced: 'testing',
      projectItemsList: [
        {
          criteriaScoring: ['value', 'value']
        },
        {
          criteriaScoring: ['value']
        }
      ]
    }
    expect(getDesirabilityAnswers({})).toEqual({
      energySource: ['value'],
      agriculturalSectorRobotics: ['value'],
      dataAnalytics: 'testing',
      technologyUse: 'testing',
      labourReplaced: 'testing',
      eligibilityCriteria: [['value', 'value'], ['value']]
    })

    dict = {
      ...dict,
      energySource: 'value',
      agriculturalSector: 'value',
      labourReplaced: null,
      projectItemsList: null
    }

    expect(getDesirabilityAnswers({})).toEqual({
      energySource: ['value'],
      agriculturalSectorRobotics: ['value'],
      dataAnalytics: 'testing',
      technologyUse: 'testing',
      labourReplaced: 'Not applicable',
      eligibilityCriteria: [['Not applicable']]
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
      solarOutput: 'Solar panels not chosen'
    })

    dict = {
      ...dict,
      projectSubject: ''
    }
    expect(getDesirabilityAnswers({})).toEqual(null)
  })

})
