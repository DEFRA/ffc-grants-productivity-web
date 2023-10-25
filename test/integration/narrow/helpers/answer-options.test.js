const { getOptions, setOptionsLabel } = require('../../../../app/helpers/answer-options')

// jest.mock('../../../../app/helpers/standardised-grant-amounts-array', () => ({
//   formatAnswerArray: (a, b, c, d) => ([ 'answer-1', 'answer-2' ]),
// }));
describe('answer-options', () => {
  test('check getOptions()', () => {
    let question = {
      costDataType: 'cost-data-type',
      answers: [],
      yarKey: 'mock-yarKey',
      type: 'input',
      classes: 'mock-classes',
      hint: {text: 'voila'},
      id: 'mock-id',
      label: 'mock-label',
      prefix: 'mock-prefix',
      suffix: 'mock-suffix',
      value: 'mock-value'
    }
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual({
      classes: 'mock-classes',
      hint:  {text: 'voila'},
      id: 'mock-yarKey',
      name: 'mock-yarKey',
      label: 'mock-label',
      prefix: 'mock-prefix',
      suffix: 'mock-suffix',
      value: ''
    })

    question = {
      ...question,
      type: 'email'
    }
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual({
      classes: 'mock-classes',
      hint:  {text: 'voila'},
      id: 'mock-yarKey',
      name: 'mock-yarKey',
      label: 'mock-label',
      prefix: 'mock-prefix',
      suffix: 'mock-suffix',
      value: ''
    })

    question = {
      ...question,
      type: 'tel'
    }
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual({
      classes: 'mock-classes',
      hint: {text: 'voila'},
      id: 'mock-yarKey',
      name: 'mock-yarKey',
      label: 'mock-label',
      prefix: 'mock-prefix',
      suffix: 'mock-suffix',
      value: ''
    })

    question = {
      ...question,
      type: 'multi-input',
      allFields: [
        {
          yarKey: 'mock-yarkey',
          type: 'switch-default',
          answers: [{ value: 'value', hint: 'hint', text: 'text', conditional: 'conditional' }]
        },
        {
          yarKey: 'projectName',
          type: 'textarea',
          answers: [{ value: 'value', hint: {text: 'haha'}, text: 'text', conditional: 'conditional' }],
          hint: {
            text: 'ahhh'
          }
        },
        {
          yarKey: 'randomName',
          type: 'textarea',
          answers: [{ value: 'value', hint: {text: 'haha'}, text: 'text', conditional: 'conditional' }],
          hint: {
            text: 'ahh'
          }
        }
      ]
    }
    const data = { 'mock-yarkey': 'mock-value' }
    expect(getOptions(data, question, 'cond-html', {})).toEqual([
      {
        classes: 'govuk-fieldset__legend--l',
        endFieldset: undefined,
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true,
            text: undefined
          }
        },
        hint: undefined,
        id: 'mock-yarkey',
        items: [
          { checked: true, conditional: 'conditional', hint: 'hint', selected: false, text: 'text', value: 'value' }
        ],
        name: 'mock-yarkey',
        type: 'switch-default'
      },
      {
        classes: undefined,
        endFieldset: undefined,
        hint: {
          text: 'For example, Browns Hill Farm robotic milking'
        },
        id: 'projectName',
        label: undefined,
        maxlength: undefined,
        name: 'projectName',
        prefix: undefined,
        suffix: undefined,
        type: 'textarea',
        value: '',
      },
      {
        classes: undefined,
        endFieldset: undefined,
        hint: {
          text: 'ahh'
        },
        id: 'randomName',
        label: undefined,
        maxlength: undefined,
        name: 'randomName',
        prefix: undefined,
        suffix: undefined,
        type: 'textarea',
        value: '',
      }
    ])
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual([
      {
        classes: 'govuk-fieldset__legend--l',
        endFieldset: undefined,
        fieldset: {
          legend: {
            classes: 'govuk-fieldset__legend--l',
            isPageHeading: true,
            text: undefined
          }
        },
        hint: undefined,
        id: 'mock-yarkey',
        items: [
          { checked: false, conditional: 'conditional', hint: 'hint', selected: false, text: 'text', value: 'value' }
        ],
        name: 'mock-yarkey',
        type: 'switch-default'
      },
      {
        classes: undefined,
        endFieldset: undefined,
        hint: {
          text: 'For example, Browns Hill Farm robotic milking'
        },
        id: 'projectName',
        label: undefined,
        maxlength: undefined,
        name: 'projectName',
        prefix: undefined,
        suffix: undefined,
        type: 'textarea',
        value: '',
      },
      {
        classes: undefined,
        endFieldset: undefined,
        hint: {
          text: 'ahh'
        },
        id: 'randomName',
        label: undefined,
        maxlength: undefined,
        name: 'randomName',
        prefix: undefined,
        suffix: undefined,
        type: 'textarea',
        value: '',
      }
    ])

    question = {
      ...question,
      type: 'select'
    }

    expect(getOptions(undefined, question, 'cond-html', {})).toEqual({
      classes: 'mock-classes',
      hint: {text: 'voila'},
      id: 'mock-yarKey',
      name: 'mock-yarKey',
      label: 'mock-label',
      items: [
        {
          text: 'Select an option',
          value: ''
        }
      ]
    })

    const { classes, ...questionWithoutClasses } = question
    expect(getOptions(undefined, questionWithoutClasses, 'cond-html', {})).toEqual({
      classes: 'govuk-fieldset__legend--l',
      hint: {text: 'voila'},
      id: 'mock-yarKey',
      name: 'mock-yarKey',
      label: 'mock-label',
      items: [
        {
          text: 'Select an option',
          value: ''
        }
      ]
    })

    question = {
      ...question,
      type: 'select-default'
    }
    expect(getOptions(undefined, question, 'cond-html', {})).toEqual(
      {
        classes: 'mock-classes',
        fieldset: {
          legend: {
            classes: 'mock-classes',
            isPageHeading: true,
            text: undefined
          }
        },
        hint: {text: 'voila'},
        id: 'mock-yarKey',
        items: [

        ],
        name: 'mock-yarKey'
      }
    )
  })

  test('check setOptionsLabel()', () => {
    const answers = [
      { value: 'divider' },
      { value: 'mock-data', hint: {text: 'voila'}},
      { value: 'another-mock-data', hint: {text: 'voila'}, conditional: 'mock-cond' },
      { value: 'another-mock-data', hint: {text: 'voila'}, conditional: 'mock-cond', text: 'mock-text' }
    ]
    expect(setOptionsLabel('mock-data', answers, 'cond-html')).toEqual([
      { divider: 'or' },
      {
        value: 'mock-data',
        text: 'mock-data',
        hint: {text: 'voila'},
        checked: true,
        selected: true
      },
      {
        value: 'another-mock-data',
        text: 'another-mock-data',
        conditional: { html: 'cond-html' },
        hint: {text: 'voila'},
        checked: false,
        selected: false
      },
      {
        value: 'another-mock-data',
        text: 'mock-text',
        conditional: 'mock-cond',
        hint: {text: 'voila'},
        checked: false,
        selected: false
      }
    ])
  })
})
