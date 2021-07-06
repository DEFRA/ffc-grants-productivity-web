/**
 * question type = single-answer, boolean ,input, multiinput, mullti-answer
 *
 *
 */

module.exports = {
  grantScheme: {
    key: 'FFC002',
    name: 'Productivity'
  },
  sections: [
    {
      name: 'eligibility',
      title: 'Eligibility',
      questions: [
        {
          key: 'farming-type',
          order: 1,
          title: 'What crops are you growing?',
          pageTitle: 'Crops',
          backLink: 'start',
          url: 'farming-type',
          eliminationAnswerKeys: ['farming-type-A5'],
          ineligibleContent: { heading: '', message: '', link: '' },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: 'CD1', value: 'AnswerValue' },
          sidebar: { heading: '', para: '', link: '', items: [] },
          validations: [
            {
              type: 'answerCount',
              error: 'Select only 2 options',
              regEx: '',
              dependentAnswerKey: 'Q1-A1'
            }
          ],
          answers: [
            {
              key: 'farming-type-A1',
              value: 'Change water source',
              isCorrect: true
            },
            {
              key: 'farming-type-A2',
              value: 'Improve irrigation efficiency',
              isCorrect: true
            },
            {
              key: 'farming-type-A3',
              value: 'Introduce Irrigation',
              isCorrect: true
            },
            {
              key: 'farming-type-A4',
              value: 'Increase Irrigation',
              isCorrect: true
            },
            {
              key: 'Q1-A5',
              value: 'None of the above',
              isCorrect: false
            }
          ],
          yarKey: 'farming-type'
        },
        {
          key: 'tenancy',
          order: 2,
          title: 'Is the planned project on land the farm business owns?',
          pageTitle: '',
          url: 'tenancy',
          backLink: 'farming-type',
          eliminationAnswerKeys: '',
          ineligibleContent: { heading: '', message: '', link: '' },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          classes: 'govuk-radios--inline',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: 'CD1', value: 'AnswerValue' },
          sidebar: { heading: '', para: '', link: '', items: [] },
          validations: [
            {
              type: 'answerCount',
              error: 'Select only 2 options',
              regEx: '',
              dependentAnswerKey: 'Q1-A1'
            }
          ],
          answers: [
            {
              key: 'tenancy-A1',
              value: 'Yes',
              isCorrect: true
            },
            {
              key: 'tenancy-A2',
              value: 'No',
              isCorrect: true
            }
          ],
          yarKey: 'tenancy'
        },
        {
          key: 'tenancy-length',
          order: 3,
          title: 'Is the planned project on land with a tenancy agreement in place until 2026 or after?',
          pageTitle: '',
          url: 'tenancy-length',
          backLink: 'tenancy',
          eliminationAnswerKeys: '',
          ineligibleContent: { heading: '', message: '', link: '' },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          classes: 'govuk-radios--inline',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: 'CD1', value: 'AnswerValue' },
          sidebar: { heading: '', para: '', link: '', items: [] },
          validations: [
            {
              type: 'answerCount',
              error: 'Select only 2 options',
              regEx: '',
              dependentAnswerKey: 'Q1-A1'
            }
          ],
          answers: [
            {
              key: 'tenancy-length-A1',
              value: 'Yes',
              isCorrect: true
            },
            {
              key: 'tenancy-length-A2',
              value: 'No',
              isCorrect: true
            }
          ],
          yarKey: 'tenancy-length'

        }
      ]
    }
  ]
}
