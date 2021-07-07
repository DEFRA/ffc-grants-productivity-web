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
          key: 'project-subject',
          order: 1,
          title: 'What is your project about?',
          pageTitle: 'Crops',
          backLink: 'start',
          nextUrl: 'legal-status',
          url: 'project-subject',
          eliminationAnswerKeys: ['project-subject-A5'],
          ineligibleContent: { heading: '', message: '', link: '' },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: 'CD1', value: 'AnswerValue' },
          sidebar: { heading: '', para: '', items: [] },
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
              key: 'project-subject-A1',
              value: 'Robotics and innovation',
              isCorrect: true
            },
            {
              key: 'project-subject-A2',
              value: 'Slurry acidification',
              isCorrect: true
            }
          ],
          yarKey: 'project-subject'
        },
        {
          key: 'legal-status',
          order: 2,
          title: 'What is your project about?',
          pageTitle: 'Crops',
          backLink: 'project-subject',
          nextUrl: 'country',
          url: 'legal-status',
          eliminationAnswerKeys: ['legal-status-A5'],
          ineligibleContent: { heading: '', message: '', link: '' },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: 'CD1', value: 'AnswerValue' },
          sidebar: { heading: '', para: '', items: [] },
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
              key: 'legal-status-A1',
              value: 'Sole trader',
              isCorrect: true
            },
            {
              key: 'legal-status-A2',
              value: 'Partnership',
              isCorrect: true
            },
            {
              key: 'legal-status-A3',
              value: 'Limited company',
              isCorrect: true
            },
            {
              key: 'legal-status-A4',
              value: 'Ltd Company',
              isCorrect: true
            },
            {
              key: 'legal-status-A5',
              value: 'Charity',
              isCorrect: true
            },
            {
              key: 'legal-status-A6',
              value: 'Trust',
              isCorrect: true
            },
            {
              key: 'legal-status-A7',
              value: 'Limited Liability Partnership',
              isCorrect: true
            },
            {
              key: 'legal-status-A8',
              value: 'Community Interest Company',
              isCorrect: true
            },
            {
              key: 'legal-status-A9',
              value: 'Limited Partnership',
              isCorrect: true
            },
            {
              key: 'legal-status-A10',
              value: 'Industrial and Provident Society',
              isCorrect: true
            },
            {
              key: 'legal-status-A11',
              value: 'Co-operative society (Co-Op)',
              isCorrect: true
            },
            {
              key: 'legal-status-A12',
              value: 'Community benefit society (BenCom)',
              isCorrect: true
            },
            {
              key: 'legal-status-A13',
              value: 'None of the above',
              isCorrect: true
            }
          ],
          yarKey: 'legal-status'
        },
        {
          key: 'country',
          order: 2,
          title: 'Is the planned project in England?',
          pageTitle: 'Crops',
          backLink: 'legal-status',
          url: 'country',
          eliminationAnswerKeys: ['country-A5'],
          ineligibleContent: { heading: '', message: '', link: '' },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: 'CD1', value: 'AnswerValue' },
          sidebar: { heading: '', para: '', items: [] },
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
              key: 'country-A1',
              value: 'Yes',
              isCorrect: true
            },
            {
              key: 'country-A2',
              value: 'No',
              isCorrect: false
            }
          ],
          yarKey: 'country'
        },
        {
          key: 'tenancy-length',
          order: 4,
          title: 'Does the project have planning permission?',
          pageTitle: 'Crops',
          url: 'planning-permission',
          backLink: 'country',
          eliminationAnswerKeys: '',
          ineligibleContent: { heading: '', message: '', link: '' },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: 'CD1', value: 'AnswerValue' },
          sidebar:
            { heading: '', para: '', items: [] },
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
              key: 'planning-permission-A1',
              value: 'Not needed',
              isCorrect: true
            },
            {
              key: 'planning-permission-A2',
              value: 'Secured',
              isCorrect: true
            },
            {
              key: 'planning-permission-A2',
              value: 'Expected to have by 31 December 2021',
              isCorrect: true
            },
            {
              key: 'planning-permission-A2',
              value: 'Will not have by 31 December 2021',
              isCorrect: false
            }
          ],
          yarKey: 'planning-permission'
        },
        {
          key: 'tenancy-length',
          order: 4,
          title: 'Does the project have planning permission?',
          pageTitle: 'Crops',
          url: 'planning-permission',
          backLink: 'country',
          eliminationAnswerKeys: '',
          ineligibleContent: { heading: '', message: '', link: '' },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: 'CD1', value: 'AnswerValue' },
          sidebar:
            { heading: '', para: '', items: [] },
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
              key: 'planning-permission-A1',
              value: 'Not needed',
              isCorrect: true
            },
            {
              key: 'planning-permission-A2',
              value: 'Secured',
              isCorrect: true
            },
            {
              key: 'planning-permission-A2',
              value: 'Expected to have by 31 December 2021',
              isCorrect: true
            },
            {
              key: 'planning-permission-A2',
              value: 'Will not have by 31 December 2021',
              isCorrect: false
            }
          ],
          yarKey: 'planning-permission'

        },
        {
          key: 'farming-type',
          order: 2,
          title: 'What crops are you growing?',
          pageTitle: 'Crops',
          backLink: 'project-subject',
          url: 'farming-type',
          eliminationAnswerKeys: ['farming-type-A5'],
          ineligibleContent: { heading: '', message: '', link: '' },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: 'CD1', value: 'AnswerValue' },
          sidebar: { heading: '', para: '', items: [] },
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
          ineligiblepara: { heading: '', message: '', link: '' },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          classes: 'govuk-radios--inline',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: 'CD1', value: 'AnswerValue' },
          sidebar: { heading: '', para: '', items: [] },
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
          sidebar: { heading: '', para: '', items: [] },
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
