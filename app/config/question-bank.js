const {
  CURRENCY_FORMAT,
  CHARS_MAX_10,
  CHARS_MIN_10,
  CHARS_MAX_100,
  CHARS_MAX_250,
  POSTCODE_REGEX,
  WHOLE_NUMBER_REGEX,
  NUMBER_REGEX,
  SBI_REGEX,
  NAME_ONLY_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX
} = require('../helpers/regex')

const { LIST_COUNTIES } = require('../helpers/all-counties')

require('dotenv').config()

/**
 * ----------------------------------------------------------------
 * list of yarKeys not bound to an answer, calculated separately
 * -  calculatedGrant
 * -  remainingCost
 *
 * Mainly to replace the value of a previously stored input
 * Format: {{_VALUE_}}
 * eg: question.title: 'Can you pay £{{_storedYarKey_}}'
 * ----------------------------------------------------------------
 */

/**
 * ----------------------------------------------------------------
 * question type = single-answer, boolean ,input, multiinput, mullti-answer
 *
 *
 * ----------------------------------------------------------------
 */

/**
 * multi-input validation schema
 *
 *  type: 'multi-input',
    allFields: [
      {
        ...
        validate: [
          {
            type: 'NOT_EMPTY',
            error: 'Error message'
          },
          {
            type: 'REGEX',
            error: 'Error message',
            regex: SAVED_REGEX
          },
          {
            type: 'MIN_MAX',
            error: 'Error message',
            min: MINIMUM,
            max: MAXIMUM
          }
        ]
      }
    ]
 */

const questionBank = {
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
          score: {
            isScore: true,
            isDisplay: false
          },
          order: 10,
          title: 'What would you like funding for?',
          pageTitle: '',
          backUrl: 'start',
          nextUrl: 'applicant',
          url: 'project-subject',
          baseUrl: 'project-subject',
          type: 'single-answer',
          minAnswerCount: 1,
          ga: [{ journeyStart: true }],
          hint: {
            html: `
              If you want to apply for funding for both a robotics and a solar project, you must submit 2 separate applications. The maximum grant amount for both projects together is £500,000.
              <br/>
              <br/>
              Select one option
            `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what you would like funding for'
            }
          ],
          answers: [
            {
              key: 'project-subject-A1',
              value: 'Robotics and automatic technology',
              text: 'Robotics and automatic technology'
            },
            {
              key: 'project-subject-A2',
              value: 'Solar technologies',
              text: 'Solar technologies',
              redirectUrl: 'legal-status'
            }
          ],
          yarKey: 'projectSubject'
        },
        {
          key: 'applicant',
          order: 12,
          title: 'Who are you?',
          pageTitle: '',
          backUrl: 'project-subject',
          dependantNextUrl: {
            dependentQuestionYarKey: 'applicant',
            dependentAnswerKeysArray: ['applicant-A1'],
            urlOptions: {
              thenUrl: 'legal-status',
              elseUrl: 'business-location'
            }
          },
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          url: 'applicant',
          baseUrl: 'applicant',
          preValidationKeys: ['projectSubject'],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you’re a farmer or a contractor'
            }
          ],
          answers: [
            {
              key: 'applicant-A1',
              value: 'Farmer'
            },
            {
              key: 'applicant-A2',
              value: 'Contractor'
            }
          ],
          yarKey: 'applicant'
        },
        {
          key: 'business-location',
          order: 15,
          title: 'Is your business in England?',
          pageTitle: '',
          backUrl: 'applicant',
          nextUrl: 'legal-status',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          url: 'business-location',
          baseUrl: 'business-location',
          preValidationKeys: ['applicant'],
          ineligibleContent: {
            messageContent: 'This grant is only for businesses registered in England.',
            insertText: { text: 'Scotland, Wales and Northern Ireland have other grants available.' }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'This grant is only for businesses registered in England. \n \n Scotland, Wales and Northern Ireland have other grants available.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the business is in England'
            }
          ],
          answers: [
            {
              key: 'business-location-A1',
              value: 'Yes'
            },
            {
              key: 'business-location-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'businessLocation'
        },
        {
          key: 'legal-status',
          order: 20,
          title: 'What is the legal status of the business?',
          pageTitle: '',
          backUrlObject: {
            dependentQuestionYarKey: 'applicant',
            dependentAnswerKeysArray: ['applicant-A1'],
            urlOptions: {
              thenUrl: 'applicant',
              elseUrl: 'project-subject'
            }
          },
          // if user selects Solar technologies system on project-subject page, redirect to /country, otherwise redirect to /planning-permission
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A2'],
            urlOptions: {
              thenUrl: 'country',
              elseUrl: 'planning-permission'
            }
          },
          url: 'legal-status',
          baseUrl: 'legal-status',
          // preValidationKeys: ['projectSubject'],
          ineligibleContent: {
            messageContent: 'Your business does not have an eligible legal status.',
            details: {
              summaryText: 'Who is eligible',
              html: '<ul class="govuk-list govuk-list--bullet"><li>Sole trader</li><li>Partnership</li><li>Limited company</li><li>Charity</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Limited partnership</li><li>Industrial and provident society</li><li>Co-operative society (Co-Op)</li><li>Community benefit society (BenCom)</li></ul>'
            },
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            },
            warning: {
              text: 'Other types of business may be supported in future schemes',
              iconFallbackText: 'Warning'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Public organisations and local authorities cannot apply for this grant.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the legal status of the business'
            }
          ],
          answers: [
            {
              key: 'legal-status-A1',
              value: 'Sole trader'
            },
            {
              key: 'legal-status-A2',
              value: 'Partnership'
            },
            {
              key: 'legal-status-A3',
              value: 'Limited company'
            },
            {
              key: 'legal-status-A4',
              value: 'Charity'
            },
            {
              key: 'legal-status-A5',
              value: 'Trust'
            },
            {
              key: 'legal-status-A6',
              value: 'Limited liability partnership'
            },
            {
              key: 'legal-status-A7',
              value: 'Community interest company'
            },
            {
              key: 'legal-status-A8',
              value: 'Limited partnership'
            },
            {
              key: 'legal-status-A9',
              value: 'Industrial and provident society'
            },
            {
              key: 'legal-status-A10',
              value: 'Co-operative society (Co-Op)'
            },
            {
              key: 'legal-status-A11',
              value: 'Community benefit society (BenCom)'
            },
            {
              value: 'divider'
            },
            {
              key: 'legal-status-A12',
              value: 'None of the above',
              notEligible: true
            }
          ],
          errorMessage: {
            text: ''
          },
          yarKey: 'legalStatus'
        },
        {
          key: 'country',
          order: 30,
          title: 'Is the planned project in England?',
          hint: {
            text: 'The site where the work will happen'
          },
          pageTitle: '',
          backUrl: 'legal-status',
          nextUrl: 'planning-permission',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          url: 'country',
          baseUrl: 'country',
          preValidationKeys: ['legalStatus'],
          ineligibleContent: {
            messageContent: 'This grant is only for projects in England.',
            insertText: { text: 'Scotland, Wales and Northern Ireland have other grants available.' }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'This grant is only for projects in England. \n \n Scotland, Wales and Northern Ireland have other grants available.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the project is in England'
            }
          ],
          answers: [
            {
              key: 'country-A1',
              value: 'Yes'
            },
            {
              key: 'country-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'inEngland'
        },
        {
          key: 'planning-permission',
          order: 40,
          title: 'Does the project have planning permission?',
          pageTitle: '',
          url: 'planning-permission',
          baseUrl: 'planning-permission',
          backUrl: 'country',
          nextUrl: 'project-start',
          preValidationKeys: ['legalStatus'],
          ineligibleContent: {
            messageContent: 'Any planning permission must be in place before you submit your full application.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `You must have secured planning permission before you submit a full application.
                \n\n The application deadline is 31 April 2024.`,
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select when the project will have planning permission'
            }
          ],
          answers: [
            {
              key: 'planning-permission-A1',
              value: 'Not needed'
            },
            {
              key: 'planning-permission-A2',
              value: 'Secured'
            },
            {
              key: 'planning-permission-A3',
              value: 'Should be in place by the time I make my full application',
              redirectUrl: 'planning-required-condition'
            },
            {
              key: 'planning-permission-A4',
              value: 'Will not be in place by the time I make my full application',
              notEligible: true
            }
          ],
          yarKey: 'planningPermission'
        },
        {
          key: 'planning-required-condition',
          title: 'You may be able to apply for a grant from this scheme',
          order: 91,
          url: 'planning-required-condition',
          backUrl: 'planning-permission',
          nextUrl: 'project-start',
          preValidationKeys: ['planningPermission'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'Any planning permission must be in place before you submit your full application. The application deadline is 31 April 2024.'
          }
        },
        {
          key: 'project-start',
          order: 50,
          title: 'Have you already started work on the project?',
          pageTitle: '',
          url: 'project-start',
          baseUrl: 'project-start',
          preValidationKeys: ['planningPermission'],
          backUrlObject: {
            dependentQuestionYarKey: 'planningPermission',
            dependentAnswerKeysArray: ['planning-permission-A3'],
            urlOptions: {
              thenUrl: '/productivity/planning-required-condition',
              elseUrl: '/productivity/planning-permission'
            }
          },
          nextUrl:'tenancy',
          ineligibleContent: {
            messageContent: 'You cannot apply for a grant if you have already started work on the project.',
            insertText: { text: 'Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement invalidates your application.' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You will invalidate your application if you start the project or commit to any costs (such as placing orders) before you receive a funding agreement.\n \n Before you start the project, you can:',
                items: ['get quotes from suppliers', 'apply for planning permissions (this can take a long time)']
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select the option that applies to your project'
            }
          ],
          answers: [
            {
              key: 'project-start-A1',
              value: 'Yes, preparatory work',
              hint: {
                text: 'For example, quotes from suppliers, applying for planning permission'
              }
            },
            {
              key: 'project-start-A2',
              value: 'Yes, we have begun project work',
              hint: {
                text: 'For example, started construction work, signing contracts, placing orders'
              },
              notEligible: true
            },
            {
              key: 'project-start-A3',
              value: 'No, we have not done any work on this project yet'
            }
          ],
          warning: {
            text: 'You must not start the project work or commit to project costs before receiving your funding agreement.',
            iconFallbackText: 'Warning'
          },
          yarKey: 'projectStart'

        },
        {
          key: 'tenancy',
          order: 60,
          title: 'Is the planned project on land the business owns?',
          pageTitle: '',
          url: 'tenancy',
          baseUrl: 'tenancy',
          backUrl: 'project-start',
          preValidationKeys: ['projectStart'],
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A2'],
            urlOptions: {
              thenUrl: 'solar/existing-solar',
              elseUrl: 'project-responsibility'
            }
          },
          hint: {
            html: 'The site where the work will happen'
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'single-answer',
          classes: ' govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The land must be owned or have a tenancy in place until 2027 before starting the project.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the planned project is on land the farm business owns'
            }
          ],
          answers: [
            {
              key: 'tenancy-A1',
              value: 'Yes'
            },
            {
              key: 'tenancy-A2',
              value: 'No',
              redirectUrl: 'project-responsibility'
            }
          ],
          yarKey: 'tenancy'
        },
        {
          key: 'project-responsibility',
          order: 65,
          title: 'Will you take full responsibility for your project?',
          hint: {
            html: `If you are on a short tenancy, you can ask your landlord to underwrite your agreement. This means they will take over your agreement if your tenancy ends. For example, your landlord could pass the agreed project to the new tenant.<br/><br/>
            This approach is optional and we will only ask for details at full application.`
          },
          pageTitle: '',
          url: 'project-responsibility',
          baseUrl: 'project-responsibility',
          backUrl: 'tenancy',
          nextUrl: 'solar/existing-solar',
          preValidationKeys: [],
          fundingPriorities: '',
          type: 'single-answer',
          minAnswercount: 1,
          sidebar: {
            values: [
              {
                heading: 'Eligibility',
                content: [
                  {
                    para: 'You must complete your project and keep the grant-funded items fit for purpose for 5 years after the date you receive your final grant payment.',
                    items: []
                  }
                ]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if will take full responsibility for your project'
            }
          ],
          answers: [
            {
              key: 'project-responsibility-A1',
              value: 'Yes, I plan to take full responsibility for my project'
            },
            {
              key: 'project-responsibility-A2',
              value: 'No, I plan to ask my landlord to underwrite my agreement'
            }
          ],
          yarKey: 'projectResponsibility'
        },
        {
          key: 'existing-solar',
          order: 62,
          title: 'Does your farm have an existing solar PV system?',
          pageTitle: '',
          url: 'solar/existing-solar',
          baseUrl: 'solar/existing-solar',
          nextUrl: 'solar-technologies',
          backUrlObject: {
            dependentQuestionYarKey: 'tenancy',
            dependentAnswerKeysArray: ['tenancy-A1'],
            urlOptions: {
              thenUrl: '/productivity/tenancy',
              elseUrl: '/productivity/project-responsibility'
            }
          },
          preValidationKeys: [],
          hint: {
            html: 'The site where the work will happen'
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'single-answer',
          classes: ' govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'Applicants who already have a solar PV system can still apply for this grant. For example, you can apply for a battery to support your existing solar PV panels.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if your farm has an existing solar PV system'
            }
          ],
          answers: [
            {
              key: 'existing-solar-A1',
              value: 'Yes'
            },
            {
              key: 'existing-solar-A2',
              value: 'No'
            }
          ],
          yarKey: 'existingSolar'
        },
        {
          key: 'solar-technologies',
          order: 61,
          title: 'What solar technologies does your project need?',
          pageTitle: '',
          url: 'solar/solar-technologies',
          baseUrl: 'solar/solar-technologies',
          backUrl: 'existing-solar',
          nextUrl: 'project-cost',
          preValidationKeys: [],
          id: 'solarTechnologies',
          name: 'solarTechnologies',
          hint: {
            html: `
                    You can apply for grant funding to:
                    <ul>
                      <li>buy a new solar PV system</li>
                      <li>add technology to an existing solar PV system on your farm</li>
                    </ul>
                    Select all that apply
                    `
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what solar technologies your project needs'
            }
          ],
          answers: [
            {
              key: 'solar-technologies-A1',
              value: 'An electrical grid connection',
            },
            {
              key: 'solar-technologies-A2',
              value: 'Solar panels',
            },
            {
              key: 'solar-technologies-A3',
              value: 'An inverter',
            },
            {
              key: 'solar-technologies-A4',
              value: 'A utility meter',
            },
            {
              key: 'solar-technologies-A5',
              value: 'A battery',
            },
            {
              key: 'solar-technologies-A6',
              value: 'Limit-loading power diverter to heat or cold store',
            },
          ],
          yarKey: 'solarTechnologies'
        },
        {
          key: 'solar-installation',
          order: 61,
          title: 'What solar technologies does your project need?',
          pageTitle: '',
          url: 'solar/solar-installation',
          baseUrl: 'solar-installation',
          backUrl: 'solar-technologies',
          nextUrl: 'project-cost',
          preValidationKeys: [],
          id: 'solarInstallation',
          name: 'solarInstallation',
          hint: {
            text: 'Select all that apply'
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-answer',
          minAnswerCount: 1,
          ineligibleContent: {
            messageContent:  `
                    <div class="govuk-list govuk-list--bullet">
                    <p class="govuk-body">Solar panels must be installed:</p>
                          <ul>
                            <li>on a rooftop</li>
                            <li>on an existing hardstanding area</li>
                            <li>floating (on a reservoir)</li>
                          </ul>
                    </div>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Solar panels must be installed:',
                items: ['on a rooftop', 'on an existing hardstanding area', 'floating (on a reservoir)']
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select where you will instal the solar PV panels'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'solar-installation',
                answerKey: 'solar-installation-A4'
              }
            }
          ],
          answers: [
            {
              key: 'solar-installation-A1',
              value: 'On a rooftop',
            },
            {
              key: 'solar-installation-A2',
              value: 'On an existing hardstanding area',
            },
            {
              key: 'solar-installation-A3',
              value: 'Floating (on a a reservoir)',
            },
            {
              value: 'divider'
            },
            {
              key: 'solar-installation-A4',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'solarInstallation'
        },
        {
          key: 'solar-usage',
          order: 63,
          title: 'Will you use most of the energy produced by solar on your farm?',
          pageTitle: '',
          url: 'solar/solar-usage',
          baseUrl: 'solar-usage',
          backUrl: 'remaining-costs',
          preValidationKeys: [],
          nextUrl: 'solar-size',
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that improve the environment.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you will use most of the energy produced on your farm'
            }
          ],
          answers: [
            {
              key: 'solar-usage-A1',
              value: 'Yes'
            },
            {
              key: 'solar-usage-A2',
              value: 'No',
            }
          ],
          yarKey: 'solarUsage'
        },
        {
          key: 'tenancy-length',
          order: 70,
          title: 'Do you have a tenancy agreement until 2027 or after?',
          pageTitle: '',
          url: 'tenancy-length',
          baseUrl: 'tenancy-length',
          backUrl: 'tenancy',
          preValidationKeys: ['tenancy'],
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A1'],
            urlOptions: {
              thenUrl: 'robotics/project-items',
              elseUrl: 'robotics/project-items'
            }
          },
          eliminationAnswerKeys: '',
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'The land must be owned or have a tenancy in place until 2027 before starting the project.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the land has a tenancy agreement in place until 2026 or after'
            }
          ],
          validations: [
            {
              type: '',
              error: '',
              regEx: '',
              dependentAnswerKey: ''
            }
          ],
          answers: [
            {
              key: 'tenancy-length-A1',
              value: 'Yes'
            },
            {
              key: 'tenancy-length-A2',
              value: 'No',
              redirectUrl: 'tenancy-length-condition'
            }
          ],
          yarKey: 'tenancyLength'
        },
        {
          key: 'tenancy-length-condition',
          title: 'You may be able to apply for a grant from this scheme',
          order: 71,
          url: 'tenancy-length-condition',
          backUrl: 'tenancy-length',
          preValidationKeys: ['tenancyLength'],
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A1'],
            urlOptions: {
              thenUrl: 'robotics/project-items',
              elseUrl: 'robotics/project-items'
            }
          },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'You will need to extend your tenancy agreement before you can complete a full application.'
          }
        },
        /// ////// ***************** ROBOTICS ************************************/////////////////////
        {
          key: 'robotics-project-items',
          order: 300,
          title: 'Which items does your project need?',
          pageTitle: '',
          url: 'robotics/project-items',
          baseUrl: 'robotics-project-items',
          backUrlObject: {
            dependentQuestionYarKey: ['applicant', 'tenancy'],
            dependentAnswerKeysArray: ['applicant-A2', 'tenancy-A2'],
            urlOptions: {
              thenUrl: ['/productivity/project-start', '/productivity/tenancy-length'],
              elseUrl: '/productivity/tenancy'
            }
          },
          preValidationKeys: ['projectStart'],
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectItems',
            dependentAnswerKeysArray: ['robotics-project-items-A3'],
            urlOptions: {
              thenUrl: 'robotic-equipment-items',
              elseUrl: 'project-cost'
            }
          },
          id: 'roboticsProjectItems',
          name: 'roboticsProjectItems',
          hint: {
            html: 'Select all the items your project needs'
          },
          eliminationAnswerKeys: '',
          fundingPriorities: '',
          type: 'multi-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select all the items your project needs'
            }
          ],
          answers: [
            {
              key: 'robotics-project-items-A1',
              value: 'Advanced ventilation control units',
              hint: {
                text: 'System to control and monitor ventilation of existing horticultural or livestock buildings to minimise heat loss and reduce greenhouse gas and particulate emissions'
              }
            },
            {
              key: 'robotics-project-items-A2',
              value: 'Wavelength-specific LED lighting for horticultural crops',
              hint: {
                html: 'Wavelength-specific LED lighting to aid plant growth only'
              }
            },
            {
              key: 'robotics-project-items-A3',
              value: 'Robotic equipment item'
            }
          ],
          yarKey: 'projectItems'
        },
        {
          key: 'robotic-equipment-items',
          order: 300,
          title: 'Which robotic items does your project need?',
          pageTitle: '',
          url: 'robotics/robotic-equipment-items',
          baseUrl: 'robotic-equipment-items',
          backUrl: 'project-items',
          preValidationKeys: ['projectItems'],
          dependantNextUrl: {
            dependentQuestionYarKey: 'roboticsProjectItemEquipments',
            dependentAnswerKeysArray: ['robotic-equipment-items-A8'],
            urlOptions: {
              thenUrl: 'other-robotic-equipment',
              elseUrl: 'project-cost'
            }
          },
          id: 'roboticsProjectItemEquipments',
          name: 'roboticsProjectItemEquipments',
          hint: {
            html: `Farming equipment capable of sensing and understanding its environment, making decisions, and planning and controlling its actions in a continuous loop. 
              <br /><br />
              Select all the items your project needs`
          },
          eliminationAnswerKeys: '',
          fundingPriorities: '',
          type: 'multi-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select all the robotic equipment items your project needs'
            }
          ],
          answers: [
            {
              key: 'robotic-equipment-items-A1',
              value: 'Robotic harvesting equipment'
            },
            {
              key: 'robotic-equipment-items-A2',
              value: 'Robotic weeding equipment'
            },
            {
              key: 'robotic-equipment-items-A3',
              value: 'Robotic spraying equipment'
            },
            {
              key: 'robotic-equipment-items-A4',
              value: 'Autonomous driverless tractors or platforms'
            },
            {
              key: 'robotic-equipment-items-A5',
              value: 'Voluntary robotic milking system'
            },
            {
              key: 'robotic-equipment-items-A6',
              value: 'Robotic feeding system'
            },
            {
              key: 'robotic-equipment-items-A7',
              value: 'Robotic transplanting'
            },
            {
              key: 'robotic-equipment-items-A8',
              value: 'Other autonomous robotic technology'
            }
          ],
          yarKey: 'roboticsProjectItemEquipments'
        },
        {
          key: 'other-robotic-equipment',
          order: 305,
          title: 'Does your other robotic technology fit the eligibility criteria?',
          pageTitle: '',
          backUrl: 'robotic-equipment-items',
          nextUrl: 'other-robotic-conditional',
          url: 'robotics/other-robotic-equipment',
          baseUrl: 'other-robotic-equipment',
          preValidationKeys: ['projectItems'],
          ineligibleContent: {
            messageContent: 'RPA will only fund items that:',
            messageContentList: [
              'have a sensing system and can understand their environment',
              'make decisions and plan',
              'can control its actuators (the devices that move robot joints)',
              'work in a continuous loop'
            ],
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          hint: {
            html: `All items must
            <ul><li>have a sensing system and can understand their environment</li>
            <li>make decisions and plan</li>
            <li>can control its actuators (the devices that move robot joints)</li>
            <li>work in a continuous loop</li></ul>`
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'RPA will consider items that:',
                items: ['have a sensing system and can understand their environment', 'make decisions and plan', 'can control its actuators (the devices that move robot joints)', 'work in a continuous loop']
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if your other robotic equipment meets the eligibility criteria'
            },
            {
              dependentKey: 'roboticEquipment',
              type: 'NOT_EMPTY',
              error: 'Describe your other robotic equipment'
            },
            {
              dependentKey: 'roboticEquipment',
              type: 'REGEX',
              regex: CHARS_MAX_250,
              error: 'Description must be 250 characters or fewer and use letters, numbers and punctuation'
            }
          ],
          answers: [
            {
              key: 'other-robotic-equipment-A1',
              conditional: true,
              value: 'Yes'
            },
            {
              key: 'other-robotic-equipment-A2',
              value: 'No',
              notEligible: true,
              alsoMaybeEligible: {
                dependentQuestionKey: 'robotic-equipment-items',
                dependentQuestionYarKey: 'roboticsProjectItemEquipments',
                notUniqueAnswer: 'robotic-equipment-items-A8',
                maybeEligibleContent: {
                  nextUrl: 'project-cost',
                  messageHeader: 'Your other robotic technology is not eligible for a grant from this scheme',
                  messageContent: `RPA will only fund items that:
                  <ul><li>have a sensing system and can understand their environment</li>
                  <li>make decisions and plan</li>
                  <li>can control its actuators (the devices that move robot joints)</li>
                  <li>work in a continuous loop</li></ul>`,
                  customButtonText: 'Continue with eligible items'
                }

              }

            }
          ],
          yarKey: 'otherRoboticEquipment',
          conditionalKey: 'roboticEquipment',
          conditionalLabelData: 'Enter your item, including the name, a brief description and benefit to your business'
        },
        {
          key: 'other-robotic-conditional',
          title: 'Your other robotic technology might get a grant from this scheme',
          order: 307,
          url: 'robotics/other-robotic-conditional',
          backUrl: 'other-robotic-equipment',
          nextUrl: 'project-cost',
          preValidationKeys: ['otherRoboticEquipment'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Your other robotic technology might get a grant from this scheme',
            messageContent: `RPA will assess your item and whether they will fund it.
            <br/>They will let you know if the item is eligible before the application window opens and projects are invited to apply.`,
            warning: {
              text: 'There’s no guarantee your item will be funded.',
              iconFallbackText: 'Warning'
            }
          },
          yarKey: 'otherRoboticsConditional'
        },
        {
          key: 'robotics-project-cost',
          order: 310,
          pageTitle: '',
          url: 'robotics/project-cost',
          baseUrl: 'project-cost',
          backUrlObject: {
            dependentQuestionYarKey: ['roboticsProjectItemEquipments', 'projectItems'],
            dependentAnswerKeysArray: ['robotic-equipment-items-A8', 'robotics-project-items-A3'],
            urlOptions: {
              thenUrl: ['/productivity/robotics/other-robotic-equipment', '/productivity/robotics/robotic-equipment-items'],
              elseUrl: '/productivity/robotics/project-items'
            }
          },
          nextUrl: 'potential-amount',
          preValidationKeys: ['projectItems'],
          classes: 'govuk-input--width-10',
          id: 'projectCost',
          name: 'projectCost',
          prefix: { text: '£' },
          type: 'input',
          grantInfo: {
            minGrant: 35000,
            maxGrant: 500000,
            grantPercentage: 40,
            cappedGrant: true
          },
          label: {
            text: 'What is the total estimated cost of the items?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
              You can only apply for a grant of up to 40% of the estimated costs.
              <br/>The minimum grant you can apply for this project is £35,000 (40% of £87,500).
              <br/>The maximum grant is £500,000.
              <br/><br/>Do not include VAT.
              <br/><br/>Enter amount, for example 95,000`
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: 'You can only apply for a grant of up to 40% of the estimated costs.',
            insertText: { text: 'The minimum grant you can apply for is £35,000 (40% of £87,500). The maximum grant is £500,000.' },
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [
              {
                heading: 'Eligible items selected',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerExceptThese: ['robotics-project-items-A3', 'robotic-equipment-items-A8']
                }]
              },
              {
                heading: 'Not yet eligible items',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerOnlyThese: ['robotic-equipment-items-A8']
                }]
              }
            ],
            dependentYarKeys: ['projectItems', 'roboticsProjectItemEquipments'],
            dependentQuestionKeys: ['robotics-project-items', 'robotic-equipment-items']
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the estimated cost for the items'
            },
            {
              type: 'REGEX',
              regex: CURRENCY_FORMAT,
              error: 'Enter a whole number in correct format'
            },
            {
              type: 'REGEX',
              regex: CHARS_MAX_10,
              error: 'Enter a whole number with a maximum of 10 digits'
            }
          ],
          warningConditional: {
            dependentWarningQuestionKey: 'other-robotic-equipment',
            dependentWarningAnswerKeysArray: ['other-robotic-equipment-A1'],
            ConditionalWarningMsg: {
              text: 'RPA will assess your other robotic technology and whether they can fund it. There’s no guarantee your item will be funded',
              iconFallbackText: 'Warning'
            }
          },
          answers: [],
          yarKey: 'projectCost'
        },
        {
          key: 'robotics-potential-amount',
          title: 'Potential grant funding',
          order: 320,
          url: 'robotics/potential-amount',
          backUrl: 'project-cost',
          nextUrl: 'remaining-costs',
          preValidationKeys: ['projectCost'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: 'You may be able to apply for a grant of up to £{{_calculatedGrant_}}, based on the estimated cost of £{{_projectCost_}}.',
            warning: {
              text: 'There’s no guarantee the project will receive a grant.',
              iconFallbackText: 'Warning'
            }
          }
        },
        {
          key: 'robotics-remaining-costs',
          order: 330,
          title: 'Can you pay the remaining costs of £{{_remainingCost_}}?',
          pageTitle: '',
          url: 'robotics/remaining-costs',
          baseUrl: 'remaining-costs',
          backUrl: 'project-cost',
          nextUrl: 'project-impact',
          preValidationKeys: ['projectCost'],
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: 'You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.',
            insertText: { text: 'You can use loans, overdrafts and certain other grants, such as the Basic Payment Scheme or agri-environment schemes such as the Countryside Stewardship Scheme.' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.\n\n
                
                You can use loans, overdrafts and certain other grants, such as the Basic Payment Scheme or agri-environment schemes such as the Countryside Stewardship Scheme.`,
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you can pay the remaining costs without using any other grant money'
            }
          ],
          answers: [
            {
              key: 'robotics-remaining-costs-A1',
              value: 'Yes'

            },
            {
              key: 'robotics-remaining-costs-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'canPayRemainingCost'
        },
        {
          key: 'robotics-project-impact',
          order: 340,
          title: 'Will the project improve the productivity and profitability of your business?',
          pageTitle: '',
          url: 'robotics/project-impact',
          baseUrl: 'project-impact',
          backUrl: 'remaining-costs',
          preValidationKeys: ['canPayRemainingCost'],
          ga: [
            { dimension: 'cm2', value: { type: 'journey-time' } }
          ],
          dependantNextUrl: {
            dependentQuestionYarKey: 'roboticsProjectItemEquipments',
            dependentAnswerKeysArray: ['robotic-equipment-items-A1', 'robotic-equipment-items-A2', 'robotic-equipment-items-A3', 'robotic-equipment-items-A4', 'robotic-equipment-items-A5', 'robotic-equipment-items-A6', 'robotic-equipment-items-A7', 'robotic-equipment-items-A8'],
            urlOptions: {
              thenUrl: 'data-analytics',
              elseUrl: 'energy-source'
            }
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: 'Your project must improve the productivity and profitability of your main agricultural or horticultural business.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `Your project must improve the productivity and profitability of your main agricultural or horticultural business.
                \n\n Your project’s positive environmental benefit will be assessed at full application stage.`,
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the project will improve the productivity and profitability of your business'
            }
          ],
          answers: [
            {
              key: 'robotics-project-impact-A1',
              value: 'Yes'

            },
            {
              key: 'robotics-project-impact-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'projectImpact'
        },
        {
          key: 'robotics-data-analytics',
          scheme: 'robotics',
          score: {
            isScore: true,
            isDisplay: true
          },
          order: 350,
          title: 'Will your project use data analytics to improve productivity on the farm?',
          hint: {
            text: 'Software automating data analysis to improve efficiency (for example, analysing white blood cell counts in dairy)'
          },
          pageTitle: '',
          url: 'robotics/data-analytics',
          baseUrl: 'data-analytics',
          backUrl: 'project-impact',
          nextUrl: 'energy-source',
          preValidationKeys: ['projectImpact'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '<ul><li>improve productivity</li><li>introduce innovation</li></ul>',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['improve productivity', 'introduce innovation']
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select whether your project will use data analytics to improve farm productivity'
            }
          ],

          answers: [
            {
              key: 'robotics-data-analytics-A1',
              value: 'Yes, we have the technology already'
            },
            {
              key: 'robotics-data-analytics-A2',
              value: 'Yes, we’ll buy the technology as part of the project',
              hint: {
                text: 'Software licences cannot be paid for by the grant'
              }
            },
            {
              key: 'robotics-data-analytics-A3',
              value: 'No, we will not use any data analytics'
            }
          ],
          yarKey: 'dataAnalytics'
        },
        {
          key: 'robotics-energy-source',
          scheme: 'robotics',
          score: {
            isScore: true,
            isDisplay: true
          },
          order: 360,
          title: 'What type of energy will you use?',
          pageTitle: '',
          url: 'robotics/energy-source',
          baseUrl: 'energy-source',
          preValidationKeys: ['projectImpact'],
          backUrlObject: {
            dependentQuestionYarKey: 'roboticsProjectItemEquipments',
            dependentAnswerKeysArray: ['robotic-equipment-items-A1', 'robotic-equipment-items-A2', 'robotic-equipment-items-A3', 'robotic-equipment-items-A4', 'robotic-equipment-items-A5', 'robotic-equipment-items-A6', 'robotic-equipment-items-A7', 'robotic-equipment-items-A8'],
            urlOptions: {
              thenUrl: 'data-analytics',
              elseUrl: 'project-impact'
            }
          },
          nextUrl: 'agricultural-sector',
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '<ul><li>improve the environment</li></ul>',
          type: 'multi-answer',
          minAnswerCount: 1,
          hint: {
            html: 'Select up to 2 options'
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['improve the environment']
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select up to 2 types of energy your project will use'
            },
            {
              type: 'MAX_SELECT',
              max: 2,
              error: 'Select up to 2 types of energy your project will use'
            }
          ],
          answers: [
            {
              key: 'robotics-energy-source-A1',
              value: 'Mains electricity'
            },
            {
              key: 'robotics-energy-source-A2',
              value: 'Renewable electricity generated on the farm'
            },
            {
              key: 'robotics-energy-source-A3',
              value: 'Biofuels'
            },
            {
              key: 'robotics-energy-source-A4',
              value: 'Fossil fuels'
            }
          ],
          yarKey: 'energySource'
        },
        {
          key: 'robotics-agricultural-sector',
          scheme: 'robotics',
          score: {
            isScore: true,
            isDisplay: true
          },
          order: 370,
          title: 'Which agricultural sector is your project in?',
          pageTitle: '',
          url: 'robotics/agricultural-sector',
          baseUrl: 'agricultural-sector',
          backUrl: 'energy-source',
          nextUrl: 'technology',
          preValidationKeys: ['energySource'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-answer',
          minAnswerCount: 1,
          hint: {
            text: 'Select up to 2 options'
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund sectors that:',
                items: ['have significant labour shortages', 'have not received many grants in the past, such as horticulture']
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select up to 2 sectors your project is in'
            },
            {
              type: 'MAX_SELECT',
              max: 2,
              error: 'Select up to 2 sectors your project is in'
            }
          ],
          answers: [
            {
              key: 'robotics-agricultural-sector-A1',
              value: 'Horticulture'
            },
            {
              key: 'robotics-agricultural-sector-A2',
              value: 'Arable'
            },
            {
              key: 'robotics-agricultural-sector-A3',
              value: 'Dairy livestock'
            },
            {
              key: 'robotics-agricultural-sector-A4',
              value: 'Non-dairy livestock'
            }
          ],
          yarKey: 'agriculturalSector'
        },
        {
          key: 'robotics-technology',
          scheme: 'robotics',
          score: {
            isScore: true,
            isDisplay: true
          },
          order: 380,
          title: 'Are you already using this technology?',
          pageTitle: '',
          url: 'robotics/technology',
          baseUrl: 'technology',
          backUrl: 'agricultural-sector',
          nextUrl: '/productivity/score',
          preValidationKeys: ['agriculturalSector'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '<ul><li>introduce innovation</li></ul>',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['introduce innovation']
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you have used this technology on your farm'
            }
          ],
          answers: [
            {
              key: 'robotics-technology-A1',
              value: 'Yes, we’re using it now'
            },
            {
              key: 'robotics-technology-A2',
              value: 'Yes, as a pilot, demonstration or trial'
            },
            {
              key: 'robotics-technology-A3',
              value: 'No, we haven’t used it yet'
            }
          ],
          yarKey: 'technology'
        },

        /// ////// ***************** ROBOTICS END  ************************************/////////////////////
        {
          key: 'answers',
          order: 160,
          title: 'Score results',
          pageTitle: 'Crops',
          url: 'answers',
          baseUrl: 'answers',
          backUrlObject: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A1'],
            urlOptions: {
              thenUrl: 'robotics/technology',
              elseUrl: 'slurry/slurry-to-be-treated'
            }
          },
          nextUrl: 'business-details',
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          answers: []
        },
        {
          key: 'business-details',
          order: 180,
          title: 'Business details',
          pageTitle: 'Crops',
          url: 'business-details',
          baseUrl: 'business-details',
          backUrl: 'score',
          nextUrl: '/productivity/applying',
          preValidationKeys: ['current-score'],
          ga: [
            { dimension: 'cd2', value: { type: 'score' } },
            { dimension: 'cm1', value: { type: 'journey-time' } }
          ],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              yarKey: 'projectName',
              type: 'input',
              label: {
                text: 'Project name',
                classes: 'govuk-label'
              },
              hint: {
                text: ''
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a project name'
                }
              ]
            },
            {
              yarKey: 'businessName',
              type: 'input',
              label: {
                text: 'Business name',
                classes: 'govuk-label'
              },
              hint: {
                text: 'If you’re registered on the Rural Payments system, enter business name as registered'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter a business name'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              yarKey: 'numberEmployees',
              type: 'input',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Number of employees',
                classes: 'govuk-label'
              },
              hint: {
                text: 'Full-time employees, including the owner'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the number of employees'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: 'Number of employees must be a whole number, like 305'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 9999999,
                  error: 'Number must be between 1-9999999'
                }
              ]
            },
            {
              yarKey: 'businessTurnover',
              type: 'input',
              classes: 'govuk-input--width-10',
              prefix: {
                text: '£'
              },
              label: {
                text: 'Business turnover (£)',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the business turnover'
                },
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX,
                  error: 'Business turnover must be a whole number, like 100000'
                },
                {
                  type: 'MIN_MAX',
                  min: 1,
                  max: 999999999,
                  error: 'Number must be between 1-999999999'
                }
              ]
            },
            {
              yarKey: 'sbi',
              type: 'input',
              title: 'Single Business Identifier (SBI)',
              classes: 'govuk-input govuk-input--width-10',
              label: {
                text: 'Single Business Identifier (SBI)',
                classes: 'govuk-label'
              },
              hint: {
                html: 'If you do not have an SBI, you will need to get one for full application'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: SBI_REGEX,
                  error: 'SBI number must have 9 characters, like 011115678'
                }

              ],
              answers: []
            }
          ],
          yarKey: 'businessDetails'
        },
        {
          key: 'applying',
          order: 190,
          title: 'Who is applying for this grant?',
          pageTitle: '',
          url: 'applying',
          baseUrl: 'applying',
          backUrl: 'business-details',
          dependantNextUrl: {
            dependentQuestionYarKey: 'applicant',
            dependentAnswerKeysArray: ['applicant-A1'],
            urlOptions: {
              thenUrl: '/productivity/farmers-details',
              elseUrl: '/productivity/contractors-details'
            }
          },
          preValidationKeys: ['businessDetails'],
          eliminationAnswerKeys: '',
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select who is applying for this grant'
            }
          ],
          answers: [
            {
              key: 'applying-A1',
              value: 'Applicant'
            },
            {
              key: 'applying-A2',
              value: 'Agent',
              redirectUrl: '/productivity/agents-details'
            }
          ],
          yarKey: 'applying'
        },
        {
          key: 'farmer-details',
          order: 200,
          title: 'Farmer’s details',
          pageTitle: '',
          url: 'farmers-details',
          baseUrl: 'farmer-details',
          nextUrl: 'check-details',
          preValidationKeys: ['applying'],
          eliminationAnswerKeys: '',
          backUrlObject: {
            dependentQuestionYarKey: 'applying',
            dependentAnswerKeysArray: ['applying-A2'],
            urlOptions: {
              thenUrl: '/productivity/agents-details',
              elseUrl: '/productivity/applying'
            }
          },
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          ga: [{ dimension: 'cd3', value: { type: 'yar', key: 'applying' } }],
          allFields: [
            {
              type: 'sub-heading',
              text: 'Name'
            },
            {
              yarKey: 'firstName',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                text: 'First name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your first name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'lastName',
              type: 'input',
              endFieldset: 'true',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Last name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your last name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Contact details'
            },
            {
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Email address',
                classes: 'govuk-label'
              },
              hint: {
                text: "We'll only use this to send them confirmation"
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your email address'
                },
                {
                  type: 'REGEX',
                  regex: EMAIL_REGEX,
                  error: 'Enter an email address in the correct format, like name@example.com'
                }
              ]
            },
            {
              yarKey: 'mobileNumber',
              type: 'tel',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Mobile number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a mobile number (if you do not have a mobile, enter your landline number)',
                  extraFieldsToCheck: ['landlineNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your mobile number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              yarKey: 'landlineNumber',
              endFieldset: 'true',
              type: 'tel',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Landline number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a landline number (if you do not have a landline, enter your mobile number)',
                  extraFieldsToCheck: ['mobileNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your landline number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Business Address'
            },
            {
              yarKey: 'address1',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Building and street <span class="govuk-visually-hidden">line 1 of 2</span>',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your building and street details'
                }
              ]
            },
            {
              yarKey: 'address2',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                html: '<span class="govuk-visually-hidden">Building and street line 2 of 2</span>',
                classes: 'govuk-label'
              }
            },
            {
              yarKey: 'town',
              type: 'input',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Town',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your town'
                }
              ]
            },
            {
              yarKey: 'county',
              type: 'select',
              classes: 'govuk-input--width-10',
              label: {
                text: 'County',
                classes: 'govuk-label'
              },
              answers: [
                ...LIST_COUNTIES
              ],
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Select your county'
                }
              ]
            },
            {
              yarKey: 'postcode',
              type: 'input',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Business postcode',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your business postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a business postcode, like AA1 1AA'
                }
              ]
            },
            {
              yarKey: 'projectPostcode',
              type: 'input',
              endFieldset: 'true',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Project postcode',
                classes: 'govuk-label'
              },
              hint: {
                text: 'The site postcode where the work will happen'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your project postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a project postcode, like AA1 1AA'
                }
              ]
            }
          ],
          yarKey: 'farmerDetails'

        },
        {
          key: 'contractors-details',
          order: 201,
          title: 'Contractor’s details',
          pageTitle: '',
          url: 'contractors-details',
          baseUrl: 'contractors-details',
          nextUrl: 'check-details',
          preValidationKeys: ['applying'],
          eliminationAnswerKeys: '',
          backUrlObject: {
            dependentQuestionYarKey: 'applying',
            dependentAnswerKeysArray: ['applying-A1'],
            urlOptions: {
              thenUrl: '/productivity/applying',
              elseUrl: '/productivity/agents-details'
            }
          },
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          ga: [{ dimension: 'cd3', value: { type: 'yar', key: 'applying' } }],
          allFields: [
            {
              type: 'sub-heading',
              text: 'Name'
            },
            {
              yarKey: 'firstName',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                text: 'First name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your first name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'lastName',
              type: 'input',
              endFieldset: 'true',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Last name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your last name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Contact details'
            },
            {
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Email address',
                classes: 'govuk-label'
              },
              hint: {
                text: "We'll only use this to send them confirmation"
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your email address'
                },
                {
                  type: 'REGEX',
                  regex: EMAIL_REGEX,
                  error: 'Enter an email address in the correct format, like name@example.com'
                }
              ]
            },
            {
              yarKey: 'mobileNumber',
              type: 'tel',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Mobile number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact them about their application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a mobile number (if you do not have a mobile, enter your landline number)',
                  extraFieldsToCheck: ['landlineNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your mobile number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              yarKey: 'landlineNumber',
              endFieldset: 'true',
              type: 'tel',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Landline number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a landline number (if you do not have a landline, enter your mobile number)',
                  extraFieldsToCheck: ['mobileNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your landline number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Business address'
            },
            {
              yarKey: 'address1',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Building and street <span class="govuk-visually-hidden">line 1 of 2</span>',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your building and street details'
                }
              ]
            },
            {
              yarKey: 'address2',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                html: '<span class="govuk-visually-hidden">Building and street line 2 of 2</span>',
                classes: 'govuk-label'
              }
            },
            {
              yarKey: 'town',
              type: 'input',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Town',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your town'
                }
              ]
            },
            {
              yarKey: 'county',
              type: 'select',
              classes: 'govuk-input--width-10',
              label: {
                text: 'County',
                classes: 'govuk-label'
              },
              answers: [
                ...LIST_COUNTIES
              ],
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Select your county'
                }
              ]
            },
            {
              yarKey: 'postcode',
              type: 'input',
              endFieldset: 'true',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Postcode',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a postcode, like AA1 1AA'
                }
              ]
            }
          ],
          yarKey: 'contractorsDetails'

        },
        {
          key: 'agents-details',
          order: 202,
          title: 'Agent’s details',
          pageTitle: '',
          url: 'agents-details',
          baseUrl: 'agents-details',
          backUrl: 'applying',
          dependantNextUrl: {
            dependentQuestionYarKey: 'applicant',
            dependentAnswerKeysArray: ['applicant-A1'],
            urlOptions: {
              thenUrl: '/productivity/farmers-details',
              elseUrl: '/productivity/contractors-details'
            }
          },
          preValidationKeys: ['applying'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              type: 'sub-heading',
              text: 'Name'
            },
            {
              yarKey: 'firstName',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                text: 'First name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your first name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'lastName',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Last name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your last name'
                },
                {
                  type: 'REGEX',
                  regex: NAME_ONLY_REGEX,
                  error: 'Name must only include letters, hyphens and apostrophes'
                }
              ]
            },
            {
              yarKey: 'businessName',
              type: 'input',
              endFieldset: 'true',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Business name',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your business name'
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MAX_100,
                  error: 'Name must be 100 characters or fewer'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Contact details'
            },
            {
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Email address',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to send you a confirmation'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your email address'
                },
                {
                  type: 'REGEX',
                  regex: EMAIL_REGEX,
                  error: 'Enter an email address in the correct format, like name@example.com'
                }
              ]
            },
            {
              yarKey: 'mobileNumber',
              type: 'tel',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Mobile number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a mobile number (if you do not have a mobile, enter your landline number)',
                  extraFieldsToCheck: ['landlineNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your mobile number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              yarKey: 'landlineNumber',
              type: 'tel',
              endFieldset: 'true',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Landline number',
                classes: 'govuk-label'
              },
              hint: {
                text: 'We will only use this to contact you about your application'
              },
              validate: [
                {
                  type: 'NOT_EMPTY_EXTRA',
                  error: 'Enter a landline number (if you do not have a landline, enter your mobile number)',
                  extraFieldsToCheck: ['mobileNumber']
                },
                {
                  type: 'REGEX',
                  regex: CHARS_MIN_10,
                  error: 'Your landline number must have at least 10 characters'
                },
                {
                  type: 'REGEX',
                  regex: PHONE_REGEX,
                  error: 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192'
                }
              ]
            },
            {
              type: 'sub-heading',
              text: 'Business address'
            },
            {
              yarKey: 'address1',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                html: 'Building and street <span class="govuk-visually-hidden">line 1 of 2</span>',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your building and street details'
                }
              ]
            },
            {
              yarKey: 'address2',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                html: '<span class="govuk-visually-hidden">Building and street line 2 of 2</span>',
                classes: 'govuk-label'
              }
            },
            {
              yarKey: 'town',
              type: 'input',
              classes: 'govuk-input--width-10',
              label: {
                text: 'Town',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your town'
                }
              ]
            },
            {
              yarKey: 'county',
              type: 'select',
              classes: 'govuk-input--width-10',
              label: {
                text: 'County',
                classes: 'govuk-label'
              },
              answers: [
                ...LIST_COUNTIES
              ],
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Select your county'
                }
              ]
            },
            {
              yarKey: 'postcode',
              type: 'input',
              endFieldset: 'true',
              classes: 'govuk-input--width-5',
              label: {
                text: 'Postcode',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your postcode, like AA1 1AA'
                },
                {
                  type: 'REGEX',
                  regex: POSTCODE_REGEX,
                  error: 'Enter a postcode, like AA1 1AA'
                }
              ]
            }
          ],
          yarKey: 'agentsDetails'

        },
        {
          key: 'check-details',
          order: 210,
          title: 'Check your details',
          pageTitle: 'Check details',
          url: 'check-details',
          backUrlObject: {
            dependentQuestionYarKey: 'applicant',
            dependentAnswerKeysArray: ['applicant-A1'],
            urlOptions: {
              thenUrl: 'farmers-details',
              elseUrl: 'contractors-details'
            }
          },
          nextUrl: 'confirm',
          preValidationKeys: ['applying'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          pageData: {
            businessDetailsLink: 'business-details',
            agentDetailsLink: 'agents-details',
            contractorDetailsLink: 'contractors-details',
            farmerDetailsLink: 'farmers-details'
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: []
        },
        {
          key: 'confirm',
          title: 'Confirm and send',
          order: 220,
          url: 'confirm',
          backUrl: 'check-details',
          nextUrl: 'confirmation',
          preValidationKeys: ['farmerDetails', 'contractorsDetails'],
          preValidationKeysRule: { condition: 'ANY' },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Confirm and send',
            messageContent: `<ul class="govuk-list"> <li>I confirm that, to the best of my knowledge, the details I have provided are correct.</li>
            <li> I understand the score was based on the answers I provided.</li>
            <li> I am aware the information I submit will be checked.</li>
            <li> I am happy to be contacted by Defra and RPA (or a third-party on their behalf) about my application.</li></ul>
            <br/>So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third-party working for us, to contact you.`
          },
          answers: [
            {
              key: 'consentOptional',
              value: 'CONSENT_OPTIONAL'
            }
          ],
          yarKey: 'consentOptional'
        },
        {
          key: 'reference-number',
          order: 230,
          title: 'Details submitted',
          pageTitle: '',
          url: 'confirmation',
          baseUrl: 'confirmation',
          preValidationKeys: ['consentOptional'],
          ga: [
            { dimension: 'cd2', value: { type: 'score' } },
            { dimension: 'cd5', value: { type: 'confirmationId' } },
            { dimension: 'cm1', value: { type: 'journey-time' } }
          ],
          maybeEligible: true,
          maybeEligibleContent: {
            reference: {
              titleText: 'Details submitted',
              html: 'Your reference number<br><strong>{{_confirmationId_}}</strong>',
              surveyLink: process.env.SURVEY_LINK
            },
            messageContent: `You will get an email with a record of your answers.<br/><br/>
            If you do not get an email within 72 hours, please call the RPA helpline and follow the options for the Farming Transformation Fund scheme:<br/><br/>
            Telephone: 03000 200 301<br/>
            <br/>Monday to Friday, 9am to 5pm (except public holidays)<br/>
            <p><a class="govuk-link" target="_blank" href="https://www.gov.uk/call-charges" rel="noopener noreferrer">Find out about call charges (opens in new tab)</a></p>
            
            Email: <a class="govuk-link" title="Send email to RPA" target="_blank" href="mailto:ftf@rpa.gov.uk" rel="noopener noreferrer">FTF@rpa.gov.uk</a>
            
            <p>RPA will be in touch when the full application period opens. They'll tell you about the application form and any guidance you need to submit a full application.</p>`,
            warning: {
              text: 'You must not start the project'
            },
            extraMessageContent: `<p>Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.</p> 
            <p>Before you start the project, you can:</p>
            <ul>
              <li>get quotes from suppliers</li>
              <li>apply for planning permission</li>
            </ul>
            <p><b>You will not automatically get a grant.</b> The grant is expected to be highly competitive and you are competing against other projects.</p>`
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: []
        }
      ]
    }
  ]
}

const ALL_QUESTIONS = []
questionBank.sections.forEach(({ questions }) => {
  ALL_QUESTIONS.push(...questions)
})
const ALL_URLS = []
ALL_QUESTIONS.forEach(question => ALL_URLS.push(question.url))

const YAR_KEYS = ['projectPostcode', 'remainingCost', 'roboticEquipment']
ALL_QUESTIONS.forEach(question => question.yarKey && YAR_KEYS.push(question.yarKey))
module.exports = {
  questionBank,
  ALL_QUESTIONS,
  YAR_KEYS,
  ALL_URLS
}
