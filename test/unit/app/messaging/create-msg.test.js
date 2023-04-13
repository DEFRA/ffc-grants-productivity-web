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

    // dict = {
    //   ...dict,
    //   waterSourcePlanned: 'wtr-src-pln',
    //   mainsChange: 'mns-chn',
    //   summerAbstractChange: null
    // }
    expect(getDesirabilityAnswers({})).toEqual({
      projectImpacts: 'hello',
      projectSubject: 'hello'
    })

    dict = {
      ...dict,
      projectImpacts: ''
    }
    expect(getDesirabilityAnswers({})).toEqual(null)
  })
})
