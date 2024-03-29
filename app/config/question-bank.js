const {
  WHOLE_NUMBER_REGEX_ZERO,
  CURRENCY_FORMAT,
  CHARS_MAX_10,
  CHARS_MIN_10,
  CHARS_MAX_18,
  CHARS_MAX_100,
  CHARS_MAX_250,
  POSTCODE_REGEX,
  WHOLE_NUMBER_REGEX,
  NUMBER_REGEX,
  PROJECT_COST_REGEX,
  SBI_REGEX,
  NAME_ONLY_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  ADDRESS_REGEX

} = require('../helpers/regex')

const urlPrefix = require('../config/server').urlPrefix

const { LIST_COUNTIES } = require('../helpers/all-counties')

const {
  MIN_GRANT,
  MAX_GRANT,
  GRANT_PERCENTAGE
} = require('../helpers/grant-details')
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
          title: 'What do you need funding for?',
          pageTitle: '',
          backUrl: 'start',
          nextUrl: 'applicant',
          url: 'project-subject',
          baseUrl: 'project-subject',
          type: 'single-answer',
          minAnswerCount: 1,
          ga: { journeyStart: true },
          hint: {
            html: `
              If you want to apply for both a farm productivity project and a solar project, you must submit 2 separate applications. 
              <br/>
              <br/>
              The maximum grant amount for both projects together is £500,000.
              <br/>
              <br/>
              Select one option
            `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what you need funding for'
            }
          ],
          answers: [
            {
              key: 'project-subject-A1',
              value: 'Farm productivity project items',
              text: 'Farm productivity project items'
            },
            {
              key: 'project-subject-A2',
              value: 'Solar project items',
              text: 'Solar project items'
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
          ineligibleContent: {
            messageContent: 'Contractors cannot apply for grant funding for solar project items.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
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
          preValidationObject: {
            preValidationKeys: ['applicant'],
            preValidationAnswer: ['applicant-A2'],
            preValidationRule: 'AND',
            preValidationUrls: ['applicant']
          },
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
              }],
              

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
            dependentQuestionYarKey: ['applicant'],
            dependentAnswerKeysArray: ['applicant-A1'],
            urlOptions: {
              thenUrl: ['applicant'],
              elseUrl: 'business-location'
            }
          },
          nextUrl: 'country',
          url: 'legal-status',
          baseUrl: 'legal-status',
          preValidationObject: {
            preValidationKeys: ['businessLocation', 'applicant'], 
            preValidationAnswer: ['business-location-A1', 'applicant-A1'],
            preValidationRule: 'OR',
            preValidationUrls: ['business-location', 'applicant']
          },          
          ineligibleContent: {
            messageContent: 'Your business does not have an eligible legal status.',
            details: {
              summaryText: 'Who is eligible',
              html: '<ul class="govuk-list govuk-list--bullet"><li>Sole trader</li><li>Partnership</li><li>Limited company</li><li>Charity</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Limited partnership</li><li>Industrial and provident society</li><li>Co-operative society (Co-Op)</li><li>Community benefit society (BenCom)</li></ul>'
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
              }],
              

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
            text: '' // why?
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
          preValidationObject: {
            preValidationKeys: ['legalStatus'],
            preValidationAnswer: ['legal-status-A12'],
            preValidationRule: 'NOT',
            preValidationUrls: ['legal-status']
          },
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
              }],
              

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
          preValidationObject: {
            preValidationKeys: ['inEngland'],
            preValidationAnswer: ['country-A1'],
            preValidationRule: 'AND',
            preValidationUrls: ['country']
          },
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
                \n\n The application deadline is 30 June 2025.`,
                items: []
              }],
              

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
          preValidationObject: {
            preValidationKeys: ['planningPermission'],
            preValidationAnswer: ['planning-permission-A3'],
            preValidationRule: 'AND',
            preValidationUrls: ['planning-permission']
          },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: `Any planning permission must be in place before you submit your full application.<br/><br/>
                            The application deadline is 30 June 2025.`
          }
        },
        {
          key: 'project-start',
          order: 50,
          title: 'Have you already started work on the project?',
          pageTitle: '',
          url: 'project-start',
          baseUrl: 'project-start',
          preValidationObject: {
            preValidationKeys: ['planningPermission'],
            preValidationAnswer: ['planning-permission-A4'],
            preValidationRule: 'NOT',
            preValidationUrls: ['planning-permission']
          },
          backUrlObject: {
            dependentQuestionYarKey: 'planningPermission',
            dependentAnswerKeysArray: ['planning-permission-A3'],
            urlOptions: {
              thenUrl: 'planning-required-condition',
              elseUrl: 'planning-permission'
            }
          },
          nextUrl: 'tenancy',
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
              }],
              

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
          preValidationObject: {
            preValidationKeys: ['projectStart'],
            preValidationAnswer: ['project-start-A2'],
            preValidationRule: 'NOT',
            preValidationUrls: ['project-start']
          },
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A2'],
            urlOptions: {
              thenUrl: 'existing-solar',
              elseUrl: 'project-items'
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
                para: 'If you are a tenant farmer, you will have the option to ask your landlord to underwrite your agreement.',
                items: []
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if the planned project is on land the business owns'
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
            html: `If you are on a short tenancy, you can ask your landlord to underwrite your agreement. This means they will take over your agreement if your tenancy ends.<br/><br/>
            This approach is optional and we will only ask for details at full application.`
          },
          pageTitle: '',
          url: 'project-responsibility',
          baseUrl: 'project-responsibility',
          backUrl: 'tenancy',
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A2'],
            urlOptions: {
              thenUrl: 'existing-solar',
              elseUrl: 'project-items'
            }
          },
          // routing TBC
          preValidationObject: {
            preValidationKeys: ['tenancy'],
            preValidationAnswer: ['tenancy-A2'],
            preValidationRule: 'AND',
            preValidationUrls: ['tenancy']
          },
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
                ],
                

              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you will take full responsibility for your project'
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
          url: 'existing-solar',
          baseUrl: 'existing-solar',
          nextUrl: 'solar-technologies',
          backUrlObject: {
            dependentQuestionYarKey: 'tenancy',
            dependentAnswerKeysArray: ['tenancy-A1'],
            urlOptions: {
              thenUrl: 'tenancy',
              elseUrl: 'project-responsibility'
            }
          },
          preValidationObject: {
            preValidationKeys: ['tenancy', 'projectResponsibility'],
            preValidationAnswer: ['tenancy-A1', 'project-responsibility-A1', 'project-responsibility-A2'],
            preValidationRule: 'OR',
            preValidationUrls: ['tenancy', 'project-responsibility'],
            andCheck: 'project-subject-A2'
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
                para: `Applicants who already have a solar PV system can still apply for this grant. For example, you can apply for a battery to add to your existing solar PV panels.`,
                items: []
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if your farm has an existing solar PV system'
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
          title: 'What solar project items does your project need?',
          pageTitle: '',
          scheme: 'solar',
          score: {
            isScore: true,
            isDisplay: true
          },
          url: 'solar-technologies',
          baseUrl: 'solar-technologies',
          backUrl: 'existing-solar',
          nextUrl: 'project-cost-solar',
          preValidationObject: {
            preValidationKeys: ['existingSolar'],
            preValidationAnswer: ['existing-solar-A1', 'existing-solar-A2'],
            preValidationRule: 'AND',
            preValidationUrls: ['existing-solar']
          },
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
          ineligibleContent: {
            messageContent: 'If you do not have an existing solar PV system, you must apply for funding for solar PV panels to be eligible for this grant.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          eliminationAnswerKeys: '',
          fundingPriorities: '<ul class="govuk-list govuk-list--bullet govuk-!-font-size-16"><li>Include batteries</li></ul>',          
          type: 'multi-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'If you do not have an existing solar PV system, you must apply for funding for solar PV panels to be eligible for this grant.'
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what solar project items your project needs'
            }
          ],
          answers: [
            {
              key: 'solar-technologies-A1',
              value: 'An electrical grid connection'
            },
            {
              key: 'solar-technologies-A2',
              value: 'Solar PV panels'
            },
            {
              key: 'solar-technologies-A3',
              value: 'An inverter'
            },
            {
              key: 'solar-technologies-A4',
              value: 'A utility meter'
            },
            {
              key: 'solar-technologies-A5',
              value: 'A battery'
            },
            {
              key: 'solar-technologies-A6',
              value: 'Power diverter',
              hint: {
                text: 'Redirects excess solar energy to power storage (for example heat stores)'
              }
            }
          ],
          yarKey: 'solarTechnologies'
        },
        {
          key: 'solar-installation',
          order: 61,
          title: 'Where will you install the solar PV panels?',
          pageTitle: '',
          url: 'solar-installation',
          baseUrl: 'solar-installation',
          backUrl: 'solar-technologies',
          nextUrl: 'solar-output',
          preValidationObject: {
            preValidationKeys: ['solarTechnologies'],
            preValidationAnswer: ['solar-technologies-A2'],
            preValidationRule: 'NOTINCLUDES',
            preValidationUrls: ['solar-technologies']
          },
          id: 'solarInstallation',
          name: 'solarInstallation',
          hint: {
            text: 'Select all that apply'
          },
          eliminationAnswerKeys: '',
          fundingPriorities: '',
          type: 'multi-answer',
          minAnswerCount: 1,
          ineligibleContent: {
            messageContent: `
                    <div class="govuk-list govuk-list--bullet">
                    <p class="govuk-body">Solar PV panels must be installed:</p>
                          <ul>
                            <li>on a rooftop</li>
                            <li>floating on an irrigation reservoir</li>
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
                para: 'Solar PV panels must be installed:',
                items: ['on a rooftop', 'floating on an irrigation reservoir']
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select where you will install the solar PV panels'
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
              value: 'On a rooftop'
            },
            {
              key: 'solar-installation-A2',
              value: 'Floating on an irrigation reservoir '
            },
            {
              value: 'divider'
            },
            {
              key: 'solar-installation-A3',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'solarInstallation'
        },
        {
          key: 'solar-output',
          order: 64,
          title: 'How much energy will your solar PV system output?',
          hint: {
            html: 'The size of your solar PV system'
          },
          scheme: 'solar',
          score: {
            isScore: true,
            isDisplay: true
          },
          pageTitle: '',
          url: 'solar-output',
          baseUrl: 'solar-output',
          backUrl: 'solar-installation',
          preValidationObject: {
            preValidationKeys: ['solarInstallation'],
            preValidationAnswer: ['solar-installation-A3'],
            preValidationRule: 'NOT',
            preValidationUrls: ['solar-installation']
          },
          nextUrl: 'project-cost-solar',
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '<ul class="govuk-list govuk-list--bullet govuk-!-font-size-16"><li>Smaller solar PV systems</li></ul>',          
          type: 'single-answer',
          classes: 'govuk-radios govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that need smaller solar PV systems.',
                items: []
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how much energy your solar PV system will output'
            }
          ],
          answers: [
            {
              key: 'solar-output-A1',
              value: 'Up to 50kW'
            },
            {
              key: 'solar-output-A2',
              value: '51kW to 100kW',
            },
            {
              key: 'solar-output-A3',
              value: '101kW to 150kW',
            },
            {
              key: 'solar-output-A4',
              value: '151kW to 200kW',
            },
            {
              key: 'solar-output-A5',
              value: 'More than 201kW',
            }
          ],
          yarKey: 'solarOutput'
        },
        {
          key: 'project-cost-solar',
          order: 65,
          pageTitle: '',
          classes: 'govuk-input--width-10',
          url: 'project-cost-solar',
          baseUrl: 'project-cost-solar',
          backUrlObject: {
            dependentQuestionYarKey: 'solarTechnologies',
            dependentAnswerKeysArray: ['solar-technologies-A2'],
            urlOptions: {
              thenUrl: 'solar-output',
              elseUrl: 'solar-technologies'
            }
          },
          nextUrl: 'potential-amount-solar',
          fundingPriorities: '',
          preValidationObject: {
            preValidationKeys: ['solarTechnologies', 'solarOutput'],
            preValidationAnswer: ['solar-technologies-A2'],
            preValidationRule: 'SPECIFICANDANY',
            preValidationUrls: ['solar-technologies', 'solar-output']
          },
          grantInfo: {
            minGrant: MIN_GRANT,
            maxGrant: MAX_GRANT,
            grantPercentage: GRANT_PERCENTAGE,
            cappedGrant: true
          },
          type: 'input',
          prefix: {
            text: '£'
          },
          id: 'projectCost',
          label: {
            text: 'What is the total estimated cost of the solar project items?',
            classes: 'govuk-label--l',
            isPageHeading: true,
            for: 'projectCost'
          },
          hint: {
            html: `
                  <p>You can only apply for a grant of up to 25% of the estimated costs.</p>
                  <p>The minimum grant you can apply for this project is £15,000 (25% of £60,000).</p>
                  <p>The maximum grant is £100,000 (25% of £400,000).</p>
                  <p>Do not include VAT</p>
                  <p>Enter amount, for example 95,000</p>
              `
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the total estimated cost for the items'
            },
            {
              type: 'REGEX',
              regex: PROJECT_COST_REGEX,
              error: 'Enter a whole number with a maximum of 7 digits'
            },
            {
              type: 'MIN_MAX_CHARS',
              min: 1,
              max: 7,
              error: 'Enter a whole number with a maximum of 7 digits'
            }
          ],
          ineligibleContent: {
            messageContent: 'You can only apply for a grant of up to 25% of the estimated costs.',
            insertText: { text: 'The minimum grant you can apply for is £15,000 (25% of £60,000). The maximum grant is £100,000 (25% of £400,000).' },
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          answers: [],
          yarKey: 'projectCost'
        },
        {
          key: 'potential-amount-solar',
          order: 230,
          url: 'potential-amount-solar',
          baseUrl: 'potential-amount-solar',
          backUrl: 'project-cost-solar',
          nextUrl: 'remaining-costs-solar',
          preValidationObject: {
            preValidationKeys: ['projectSubject'],
            preValidationAnswer: ['project-subject-A2'],
            preValidationRule: 'OR',
            preValidationUrls: ['project-subject']
          },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: 'You may be able to apply for a grant of up to £{{_calculatedGrant_}}, based on the estimated cost of £{{_projectCost_}}.',
            warning: {
              text: 'There’s no guarantee the project will receive a grant.'
            }
          }
        },
        {
          key: 'remaining-costs-solar',
          order: 240,
          title: 'Can you pay the remaining costs of £{{_remainingCost_}}?',
          pageTitle: '',
          url: 'remaining-costs-solar',
          baseUrl: 'remaining-costs-solar',
          backUrl: 'potential-amount-solar',
          nextUrl: 'agricultural-sector-solar',
          ga: { name: 'eligibility_passed', params: {} },
          preValidationObject: {
            preValidationKeys: ['projectSubject'],
            preValidationAnswer: ['project-subject-A2'],
            preValidationRule: 'OR',
            preValidationUrls: ['project-subject']
          },
          ineligibleContent: {
            messageContent: '<p class="govuk-body">You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.</p>',
            insertText: {
              html: `
                  <p>You can use:</p>
                  <ul class="govuk-list--bullet">
                    <li>loans</li>
                    <li>overdrafts</li>
                    <li>the Basic Payment Scheme</li>
                  </ul>
            </span>`
            },
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
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.
                  
                  You can use:`,
                  items: [
                    'loans',
                    'overdrafts',
                    'the Basic Payment Scheme'
                  ]
                }]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you can pay the remaining costs'
            }
          ],
          answers: [
            {
              key: 'remaining-costs-A1',
              value: 'Yes'

            },
            {
              key: 'remaining-costs-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'remainingCosts'
        },
        {
          key: 'agricultural-sector-solar',
          scheme: 'solar',
          score: {
            isScore: true,
            isDisplay: true
          },
          order: 245,
          hint: {
            html: `Your main farm enterprises<br/><br/>
                  Select up to 2 options`
          },
          title: 'What do you farm mainly?',
          pageTitle: '',
          url: 'agricultural-sector-solar',
          baseUrl: 'agricultural-sector-solar',
          backUrl: 'remaining-costs-solar',
          nextUrl: 'score',
          preValidationKeys: ['remainingCosts'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '<ul class="govuk-list govuk-list--bullet govuk-!-font-size-16"><li>Significant labour shortages</li><li>Not received many grants in past</li></ul>',          
          type: 'multi-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund sectors that:',
                items: ['have significant labour shortages', 'have not received many grants in the past, such as dairy']
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
              key: 'agricultural-sector-solar-A1',
              value: 'Arable'
            },
            {
              key: 'agricultural-sector-solar-A2',
              value: 'Beef'
            },
            {
              key: 'agricultural-sector-solar-A3',
              value: 'Dairy livestock'
            },
            {
              key: 'agricultural-sector-solar-A4',
              value: 'Horticulture'
            },
            {
              key: 'agricultural-sector-solar-A5',
              value: 'Mixed livestock'
            },
            {
              key: 'agricultural-sector-solar-A6',
              value: 'Pig'
            },
            {
              key: 'agricultural-sector-solar-A7',
              value: 'Poultry'
            },
            {
              key: 'agricultural-sector-solar-A7',
              value: 'Sheep'
            }
          ],
          yarKey: 'agriculturalSector'
        },
        /// ////// ***************** ROBOTICS ************************************/////////////////////
        {
          key: 'project-items',
          order: 300,
          title: 'Which items does your project need?',
          pageTitle: '',
          url: 'project-items',
          baseUrl: 'project-items',
          preValidationObject: {
            preValidationKeys: ['tenancy', 'projectResponsibility'],
            preValidationAnswer: ['tenancy-A1', 'project-responsibility-A1', 'project-responsibility-A2'],
            preValidationRule: 'OR',
            preValidationUrls: ['tenancy', 'project-responsibility'],
            andCheck: 'project-subject-A1'
          },          
          backUrlObject: {
            dependentQuestionYarKey: 'tenancy',
            dependentAnswerKeysArray: ['tenancy-A1'],
            urlOptions: {
              thenUrl: 'tenancy',
              elseUrl: 'project-responsibility'
            }
          },
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectItems',
            dependentAnswerKeysArray: ['project-items-A3'],
            urlOptions: {
              thenUrl: 'technology-items',
              elseUrl: 'project-cost'
            }
          },
          id: 'projectItems',
          name: 'projectItems',
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
              error: 'Select which items your project needs'
            }
          ],
          answers: [
            {
              key: 'project-items-A1',
              value: 'Advanced ventilation control units',
              hint: {
                text: 'System to control and monitor ventilation of existing horticultural or livestock buildings to minimise heat loss and reduce greenhouse gas and particulate emissions'
              }
            },
            {
              key: 'project-items-A2',
              value: 'Wavelength-specific LED lighting for horticultural crops',
              hint: {
                html: 'Wavelength-specific LED lighting to aid plant growth only'
              }
            },
            {
              key: 'project-items-A3',
              value: 'Robotic and automatic technology'
            }
          ],
          yarKey: 'projectItems'
        },
        {
          key: 'technology-items',
          order: 310,
          title: 'What robotic or automatic technology does your project need?',
          pageTitle: '',
          url: 'technology-items',
          baseUrl: 'technology-items',
          backUrl: 'project-items',
          preValidationObject: {
            preValidationKeys: ['projectItems'],
            preValidationAnswer: ['project-items-A3'],
            preValidationRule: 'NOTINCLUDES',
            preValidationUrls: ['project-items']
          },
          nextUrl: 'robotic-automatic',
          id: 'technologyItems',
          name: 'technologyItems',
          hint: {
            html: `Technology powered by fossil fuels will only be funded where there is no commercially available electric or renewable energy alternative.<br/><br/>
            Select one option.<br/><br/>
            If you need multiple items, you can add another item later in the checker.`
          },
          eliminationAnswerKeys: '',
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'RPA will consider items that:',
                items: ['have a sensing system and can understand their environment', 'make decisions and plans', 'can control its actuators (the devices that move robot joints)', 'work in a continuous loop']
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what technology your project needs'
            }
          ],
          answers: [
            {
              key: 'technology-items-A1',
              value: 'Harvesting technology',
              contractorOnly: true
            },
            {
              key: 'technology-items-A2', 
              value: 'Transplanting technology'
            },
            {
              key: 'technology-items-A3',
              value: 'Weeding technology',
              contractorOnly: true
            },
            {
              key: 'technology-items-A4',
              value: 'Driverless robotic tractor or platform', 
              redirectUrl: 'robotic-eligibility', 
              contractorOnly: true
            },
            {
              key: 'technology-items-A5',
              value: 'Robotic spraying technology',
              redirectUrl: 'robotic-eligibility',
              contractorOnly: true
            },
            {
              key: 'technology-items-A6',
              value: 'Voluntary robotic milking system',
              redirectUrl: 'robotic-eligibility'
            },
            {
              key: 'technology-items-A7',
              value: 'Feeding robots',
              redirectUrl: 'robotic-eligibility'
            },
            {
              key: 'technology-items-A8',
              value: 'Slurry robots',
              redirectUrl: 'robotic-eligibility'
            },
            {
              key: 'technology-items-A9',
              value: 'Other robotics or automatic technology',
              contractorOnly: true
            }
          ],
          yarKey: 'technologyItems'
        },
        {
          key: 'robotic-automatic',
          order: 320,
          title: 'Is the {{_technologyItems_}} robotic or automatic?',
          replace: true,
          pageTitle: '',
          url: 'robotic-automatic',
          baseUrl: 'robotic-automatic',
          preValidationObject: {
            preValidationKeys: ['technologyItems'],
            preValidationAnswer: ['technology-items-A1', 'technology-items-A2', 'technology-items-A3', 'technology-items-A9'],
            preValidationRule: 'OR',
            preValidationUrls: ['technology-items']
          },
          backUrl: 'technology-items',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          dependantNextUrl: {
            dependentQuestionYarKey: 'roboticAutomatic',
            dependentAnswerKeysArray: ['robotic-automatic-A1'],
            urlOptions: {
              thenUrl: 'robotic-eligibility',
              elseUrl: 'automatic-eligibility'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          id: 'roboticAutomatic',
          hint: {
            html: 
            ` There are 4 eligibility criteria for grant funding.<br/><br/>
                Eligible technology should:
                  <ul>
                    <li>have a sensing system and be able to understand its environment</li>
                    <li>make decisions and plan</li>
                    <li>be able to control its actuators (the devices that move robot joints)</li>
                    <li>work in a continuous loop</li>
                  <ul>
            `
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: `Robotic technology must fit all 4 criteria to be eligible.\n\n
                Automatic technology must fit at least 2 criteria to be eligible.`
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if your technology is robotic or automatic'
            }
          ],
          answers: [
            {
              key: 'robotic-automatic-A1',
              value: 'Robotic'
            },
            {
              key: 'robotic-automatic-A2',
              value: 'Automatic',
              redirectUrl: 'automatic-eligibility'
            }
          ],
          yarKey: 'roboticAutomatic'
        },
        {
          key: 'automatic-eligibility',
          order: 375,
          title: `Which eligibility criteria does your automatic {{_technologyItems_}} meet?`,
          pageTitle: '',
          replace: true,
          url: 'automatic-eligibility',
          baseUrl: 'automatic-eligibility',
          backUrl: 'robotic-automatic',
          id: 'automaticEligibility',
          name: 'automaticEligibility',
          preValidationObject: {
            preValidationKeys: ['roboticAutomatic'],
            preValidationAnswer: ['robotic-automatic-A2'],
            preValidationRule: 'AND',
            preValidationUrls: ['robotic-automatic']
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            title: 'You cannot apply for a grant funding for this technology',
            messageContent: 'Automatic technology must fit at least 2 criteria to be eligible for grant funding.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          type: 'multi-answer',
          minAnswerCount: 1,
          hint: {
            text: 'Select all that apply'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Automatic technology must fit at least 2 criteria to be eligible for grant funding.',
                items: []
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select what eligibility criteria your automatic technology meets'
            },
            {
              type: 'STANDALONE_ANSWER',
              error: 'You cannot select that combination of options',
              standaloneObject: {
                questionKey: 'automatic-eligibility',
                answerKey: 'automatic-eligibility-A5'
              }
            }
          ],
          answers: [
            {
              key: 'automatic-eligibility-A1',
              value: 'Has sensing system that can understand its environment'
            },
            {
              key: 'automatic-eligibility-A2',
              value: 'Makes decisions and plans'
            },
            {
              key: 'automatic-eligibility-A3',
              value: 'Can control its actuators (the devices that move robotic joints)'
            },
            {
              key: 'automatic-eligibility-A4',
              value: 'Works in a continuous loop'
            },
            {
              value: 'divider'
            },
            {
              key: 'automatic-eligibility-A5',
              value: 'None of the above'
            }
          ],
          yarKey: 'automaticEligibility'
        },
        {
          key: 'robotic-eligibility',
          order: 376,
          title: `Does your robotic {{_technologyItems_}} fit the eligibility criteria?`,
          pageTitle: '',
          replace: true,
          url: 'robotic-eligibility',
          baseUrl: 'robotic-eligibility',
          backUrl: 'robotic-automatic',
          nextUrl: 'technology-description',
          preValidationObject: {
            preValidationKeys: ['roboticAutomatic', 'technologyItems'],
            preValidationAnswer: ['robotic-automatic-A1', 'technology-items-A4', 'technology-items-A5', 'technology-items-A6', 'technology-items-A7', 'technology-items-A8'],
            preValidationRule: 'OR',
            preValidationUrls: ['robotic-automatic','technology-items']
          },
          eliminationAnswerKeys: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          id: 'roboticEligibility',
          hint: {
            html: 
            `To be eligible, your robotic technology must:
                  <ul>
                    <li>have a sensing system and can understand its environment</li>
                    <li>make decisions and plan</li>
                    <li>be able to control its actuators (the devices that move robot joints)</li>
                    <li>work in a continuous loop</li>
                  <ul>
            `
          },
          ineligibleContent: {
            title: 'You cannot apply for grant funding for this technology',
            messageContent: `RPA will only fund robotic technology that:
                            <ul class="govuk-list govuk-list--bullet">
                              <li>have a sensing system and can understand their environment</li>
                              <li>make decisions and plan</li>
                              <li>can control its actuators (the devices that move robot joints)</li>
                              <li>work in a continuous loop</li>
                            </ul>`,
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Robotic technology must fit all 4 criteria to be eligible.',
                items: []
              }]
            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if your robotic technology fits the eligibility criteria'
            },
          ],
          answers: [
            {
              key: 'robotic-eligibility-A1',
              value: 'Yes'
            },
            {
              key: 'robotic-eligibility-A2',
              value: 'No',
            }
          ],
          yarKey: 'roboticEligibility'
        },
        {
          key: 'technology-description',
          order: 305,
          title: 'Describe the {{_technologyItems_}}',
          pageTitle: '',
          nextUrl: 'project-items-summary',
          url: 'technology-description',
          baseUrl: 'technology-description',
          backUrlObject: {
            dependentQuestionYarKey: ['roboticAutomatic'],
            dependentAnswerKeysArray: ['robotic-automatic-A2'],
            urlOptions: {
              thenUrl: 'automatic-eligibility',
              elseUrl: 'robotic-eligibility'
            }
          },
          preValidationObject: {
            preValidationKeys: ['automaticEligibility', 'roboticEligibility', ],
            preValidationAnswer: ['automatic-eligibility-A5', 'robotic-eligibility-A2', ],
            preValidationRule: 'NOTOR',
            preValidationUrls: ['automatic-eligibility', 'robotic-eligibility', ]
          },
          fundingPriorities: '',
          minAnswerCount: 1,
          hint: {
            html: `Technology powered by fossil fuels will only be funded where there is no commercially available electric or renewable energy alternative<br/><br/>`
          },
          type: 'multi-input',
          allFields: [
            {
              yarKey: 'itemName',
              id: "itemName",
              name: "itemName",
              type: 'text',
              maxlength: 250,
              classes: 'govuk-input--width-10',
              label: {
                text: 'Item name',
                classes: 'govuk-label',
                for: 'itemName'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter the name of the item'
                },
                {
                  type: 'MIN_MAX_CHARS',
                  min: 4,
                  max: 18,
                  error: 'Name of item must be between 4 and 18 characters'
                }
              ]
            },
            {
              yarKey: 'brand',
              id: "brand",
              name: "brand",
              type: 'text',
              maxlength: 250,
              classes: 'govuk-input--width-10',
              label: {
                text: 'Brand (optional)',
                classes: 'govuk-label',
                for: 'brand'
              },
              validate: [
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 18,
                  error: 'Brand must be 18 characters or less'
                }
              ]
            },
            {
              yarKey: 'model',
              id: "model",
              name: "model",
              type: 'text',
              maxlength: 250,
              classes: 'govuk-input--width-10',
              label: {
                text: 'Model (optional)',
                classes: 'govuk-label',
                for: 'model'
              },
              validate: [
                {
                  type: 'MIN_MAX_CHARS',
                  min: 0,
                  max: 18,
                  error: 'Model must be 18 characters or less'
                }
              ]
            },
            {
              yarKey: 'numberOfItems',
              id: "numberOfItems",
              name: "numberOfItems",
              type: 'text',
              inputmode: 'numeric',
              maxlength: 250,
              classes: 'govuk-input--width-2',
              label: {
                text: 'Number of these items (optional)',
                classes: 'govuk-label',
                for: 'numberOfItems'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: WHOLE_NUMBER_REGEX_ZERO,
                  error: 'Number of items must be a number, like 18'
                },
                {
                  type: 'MAX_ONLY',
                  max: 100,
                  error: 'Number of items must be between 0 and 100'
                }
              ]
            },
          ],
          yarKey: 'technologyDescription'
        },
        {
          key: 'project-items-summary',
          order: 310,
          title: 'Your project technology',
          hint: {
            text: 'You can add or remove technology you will be using on your project'
          },
          showButton: true,
          pageTitle: 'project-items-summary',
          url: 'project-items-summary',
          baseUrl: 'project-items-summary',
          backUrl: 'technology-description',
          nextUrl: 'item-conditional',
          preValidationKeys: ['projectItemsList'],
          sidebar: {
            values: [{
              heading: 'Your project technology',
              content: [{
                para: `Automatic technology must fit at least 2 criteria to be eligible for funding. \n\n 
                        Robotic technology must fit all 4 criteria to be eligible for funding.`
              }]
            }]
          },
          ineligibleContent: {},
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          answers: [],
          yarKey: 'projectItemsSummary'
        },
        {
          key: 'remove-item',
          order: 320,
          title: 'Are you sure you want to remove {{_errorForRemove_}}?',
          replace: true,
          pageTitle: '',
          nextUrl: 'project-items-summary',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          url: 'remove-item',
          baseUrl: 'remove-item',
          preValidationKeys: ['projectItemsList'],
          type: 'single-answer',
          minAnswerCount: 1,
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you want to remove {{_errorForRemove_}}'
            }
          ],
          answers: [
            {
              key: 'remove-item-A1',
              value: 'Yes'
            },
            {
              key: 'remove-item-A2',
              value: 'No'
            }
          ],
          yarKey: 'removeItem'
        },
        {
          key: 'item-conditional',
          title: 'Your technology might get a grant from this scheme',
          order: 309,
          url: 'item-conditional',
          baseUrl: 'item-conditional',
          backUrl: 'project-items-summary',
          nextUrl: 'project-cost',
          preValidationKeys: ['projectItemsList'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Your technology might get a grant from this scheme',
            messageContent: `RPA will assess your technology and whether they will fund it.<br/><br/>
            They will let you know if the technology is eligible before the application window opens and projects are invited to apply.`,
            warning: {
              text: 'There’s no guarantee your item will be funded.',
              iconFallbackText: 'Warning'
            }
          },
          yarKey: 'itemConditional'
        },
        {
          key: 'project-cost',
          order: 310,
          pageTitle: '',
          url: 'project-cost',
          baseUrl: 'project-cost',
          backUrlObject: {
            dependentQuestionYarKey: ['projectItems', 'applicant'],
            dependentAnswerKeysArray: ['project-items-A3', 'applicant-A2'],
            urlOptions: {
              thenUrl: ['item-conditional', 'item-conditional'],
              elseUrl: 'project-items'
            }
          },
          nextUrl: 'potential-amount',
          preValidationObject: {
            preValidationKeys: ['projectSubject'],
            preValidationAnswer: ['project-subject-A1'],
            preValidationRule: 'OR',
            preValidationUrls: ['project-subject']
          },
          classes: 'govuk-input--width-10',
          id: 'projectCost',
          name: 'projectCost',
          prefix: { text: '£' },
          type: 'input',
          grantInfo: {
            minGrant: 25000,
            maxGrant: 500000,
            grantPercentage: 50,
            cappedGrant: true
          },
          label: {
            text: 'What is the total estimated cost of the items?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
              <p>You can only apply for a grant of up to 50% of the estimated costs.</p>
              <p>The minimum grant you can apply for this project is £25,000 (50% of £50,000).</p>
              <p>The maximum grant is £500,000 (50% of £1 million).</p>
              <p>Do not include VAT.</p>
              <p>Enter amount, for example 95,000</p>`
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: 'You can only apply for a grant of up to 50% of the estimated costs.',
            insertText: { text: 'The minimum grant you can apply for is £25,000 (50% of £50,000). The maximum grant is £500,000 (50% of £1 million).' },
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
          },
          sidebar: {
            values: [
              {
                heading: 'Your project items',
                content: [{
                  para: '',
                  items: []
                }],
                
              }
            ],
            dependentYarKeys: ['projectItems'] // just needed to trigger sidebar code
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Enter the total estimated cost for the items'
            },
            {
              type: 'REGEX',
              regex: PROJECT_COST_REGEX,
              error: 'Enter a whole number with a maximum of 7 digits'
            },
            {
              type: 'MIN_MAX_CHARS',
              min: 1,
              max: 7,
              error: 'Enter a whole number with a maximum of 7 digits'
            }
          ],
          warning: {
            text: 'RPA will assess your technology and whether they can fund it. There’s no guarantee your technology will be funded.',
            iconFallbackText: 'Warning'
          },
          answers: [],
          yarKey: 'projectCost'
        },
        {
          key: 'potential-amount',
          title: 'Potential grant funding',
          order: 320,
          url: 'potential-amount',
          baseUrl: 'potential-amount',
          backUrl: 'project-cost',
          nextUrl: 'remaining-costs',
          preValidationObject: {
            preValidationKeys: ['projectSubject'],
            preValidationAnswer: ['project-subject-A1'],
            preValidationRule: 'OR',
            preValidationUrls: ['project-subject']
          },
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
          key: 'remaining-costs',
          order: 330,
          title: 'Can you pay the remaining costs of £{{_remainingCost_}}?',
          pageTitle: '',
          url: 'remaining-costs',
          baseUrl: 'remaining-costs',
          backUrl: 'potential-amount',
          nextUrl: 'project-impact',
          ga: { name: 'eligibility_passed', params: {} },
          preValidationObject: {
            preValidationKeys: ['projectSubject'],
            preValidationAnswer: ['project-subject-A1'],
            preValidationRule: 'OR',
            preValidationUrls: ['project-subject']
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: '<p class="govuk-body">You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.</p>',
            insertText: {
              html: `
                  <p>You can use:</p>
                  <ul class="govuk-list--bullet">
                    <li>loans</li>
                    <li>overdrafts</li>
                    <li>the Basic Payment Scheme</li>
                  </ul>
            </span>`
            },
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
            values: [
              {
                heading: 'Eligibility',
                content: [{
                  para: `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.
                  
                  You can use:`,
                  items: [
                    'loans',
                    'overdrafts',
                    'the Basic Payment Scheme'
                  ]
                }]
              }
            ]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select yes if you can pay the remaining costs'
            }
          ],
          answers: [
            {
              key: 'remaining-costs-A1',
              value: 'Yes'

            },
            {
              key: 'remaining-costs-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'canPayRemainingCost'
        },
        {
          key: 'project-impact',
          order: 340,
          title: 'Will the project improve the productivity and profitability of your business?',
          pageTitle: '',
          url: 'project-impact',
          baseUrl: 'project-impact',
          backUrl: 'remaining-costs',
          preValidationKeys: ['canPayRemainingCost'],
          nextUrl: 'data-analytics',
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
              }],
              

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
              key: 'project-impact-A1',
              value: 'Yes'

            },
            {
              key: 'project-impact-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'projectImpact'
        },
        {
          key: 'data-analytics',
          scheme: 'robotics',
          score: {
            isScore: true,
            isDisplay: true
          },
          order: 350,
          title: 'Will your project use data analytics to improve productivity?',
          hint: {
            text: `Software that automates the analysis of the data it collects to improve 
            efficiency (for example, analysing white blood cell counts in dairy)`
          },
          pageTitle: '',
          url: 'data-analytics',
          baseUrl: 'data-analytics',
          backUrl: 'project-impact',
          nextUrl: 'energy-source',
          preValidationObject: {
            preValidationKeys: ['projectImpact'],
            preValidationAnswer: ['project-impact-A1'],
            preValidationRule: 'OR',
            preValidationUrls: ['project-impact']
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '<ul class="govuk-list govuk-list--bullet govuk-!-font-size-16"><li>Improve productivity</li><li>Introduce innovation</li></ul>',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['improve productivity', 'introduce innovation']
              }],
              

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
              key: 'data-analytics-A1',
              value: 'Yes, we have the technology already'
            },
            {
              key: 'data-analytics-A2',
              value: 'Yes, we’ll buy the technology as part of the project',
              hint: {
                text: 'Software licences cannot be paid for by the grant'
              }
            },
            {
              key: 'data-analytics-A3',
              value: 'No, we will not use any data analytics'
            }
          ],
          yarKey: 'dataAnalytics'
        },
        {
          key: 'energy-source',
          scheme: 'robotics',
          score: {
            isScore: true,
            isDisplay: true
          },
          order: 360,
          title: 'What type of energy will you use?',
          pageTitle: '',
          url: 'energy-source',
          baseUrl: 'energy-source',
          preValidationObject: {
            preValidationKeys: ['dataAnalytics'],
            preValidationAnswer: ['data-analytics-A1', 'data-analytics-A2', 'data-analytics-A3'],
            preValidationRule: 'OR',
            preValidationUrls: ['data-analytics']
          },
          backUrlObject: {
            dependentQuestionYarKey: ['projectItems', 'applicant'],
            dependentAnswerKeysArray: ['project-items-A3', 'applicant-A2'],
            urlOptions: {
              thenUrl: ['data-analytics', 'data-analytics'],
              elseUrl: 'project-impact'
            }
          },
          dependantNextUrl: {
            dependentQuestionYarKey: 'energySource',
            dependentAnswerKeysArray: ['energy-source-A4'],
            urlOptions: {
              thenUrl: 'fossil-fuel-conditional',
              elseUrl: 'agricultural-sector'
            }
          },
          nextUrl: 'agricultural-sector',
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '<ul class="govuk-list govuk-list--bullet govuk-!-font-size-16"><li>Improve the environment</li></ul>',
          type: 'multi-answer',
          minAnswerCount: 1,
          hint: {
            html: `Technology powered by fossil fuels will only be funded where there is no 
                  commercially available electric or renewable energy alternative.<br/><br/>
                  Select up to 2 options`
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that improve the environment'
              }],
              

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
              key: 'energy-source-A1',
              value: 'Mains electricity'
            },
            {
              key: 'energy-source-A2',
              value: 'Renewable electricity generated on the farm'
            },
            {
              key: 'energy-source-A3',
              value: 'Biofuels'
            },
            {
              key: 'energy-source-A4',
              value: 'Fossil fuels'
            }
          ],
          yarKey: 'energySource'
        },
        {
          key: 'fossil-fuel-conditional',
          title: 'You may be able to apply for a grant from this scheme',
          order: 91,
          url: 'fossil-fuel-conditional',
          baseUrl: 'fossil-fuel-conditional',
          backUrl: 'energy-source',
          nextUrl: 'agricultural-sector',
          preValidationObject: {
            preValidationKeys: ['energySource'],
            preValidationAnswer: ['energy-source-A4'],
            preValidationRule: 'NOTINCLUDES',
            preValidationUrls: ['energy-source']
          },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Your fossil fuel technology might be eligible',
            messageContent: 'I confirm I understand fossil fuel technology will only be funded where there is no commercially available electric or renewable energy alternative.',
            isFossilFuel: true,
          }
        },
        {
          key: 'agricultural-sector',
          scheme: 'robotics',
          score: {
            isScore: true,
            isDisplay: true
          },
          order: 370,
          title: 'Which agricultural sector is your project in?',
          pageTitle: '',
          url: 'agricultural-sector',
          baseUrl: 'agricultural-sector',
          backUrlObject: {
            dependentQuestionYarKey: 'energySource',
            dependentAnswerKeysArray: ['energy-source-A4'],
            urlOptions: {
              thenUrl: 'fossil-fuel-conditional',
              elseUrl: 'energy-source'
            }
          },
          nextUrl: 'technology-use',
          preValidationKeys: ['energySource'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '<ul class="govuk-list govuk-list--bullet govuk-!-font-size-16"><li>Significant labour shortages</li><li>Not received many grants in past</li></ul>',
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
                items: ['have significant labour shortages', 'have not received many grants in the past, such as dairy']
              }],
              

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
              key: 'agricultural-sector-A1',
              value: 'Horticulture'
            },
            {
              key: 'agricultural-sector-A2',
              value: 'Arable'
            },
            {
              key: 'agricultural-sector-A3',
              value: 'Dairy livestock'
            },
            {
              key: 'agricultural-sector-A4',
              value: 'Non-dairy livestock'
            }
          ],
          yarKey: 'agriculturalSector'
        },
        {
          key: 'technology-use',
          scheme: 'robotics',
          score: {
            isScore: true,
            isDisplay: true
          },
          order: 380,
          title: 'Are you already using this technology?',
          pageTitle: '',
          url: 'technology-use',
          baseUrl: 'technology-use',
          backUrl: 'agricultural-sector',
          dependantNextUrl: {
            dependentQuestionYarKey: ['projectItems', 'applicant'],
            dependentAnswerKeysArray: ['project-items-A3', 'applicant-A2'],
            urlOptions: {
              thenUrl: ['labour-replaced', 'labour-replaced'],
              elseUrl: 'score'
            }
          },
          preValidationKeys: ['agriculturalSector'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '<ul class="govuk-list govuk-list--bullet govuk-!-font-size-16"><li>Introduce innovation</li></ul>',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that introduce innovation',
                items: []
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select if you are already using this technology'
            }
          ],
          answers: [
            {
              key: 'technology-use-A1',
              value: 'Yes, we’re using it now'
            },
            {
              key: 'technology-use-A2',
              value: 'Yes, we’re using it now but want to upgrade'
            },
            {
              key: 'technology-use-A3',
              value: 'Yes, as a pilot, demonstration or trial'
            },
            {
              key: 'technology-use-A4',
              value: 'No, we haven’t used it yet'
            }
          ],
          yarKey: 'technologyUse'
        },
        {
          key: 'labour-replaced',
          order: 381,
          title: 'How much manual labour will this technology replace?',
          pageTitle: '',
          hint: {
            text: 'One job is equal to 30 hours or more per week'
          },
          preValidationObject: {
            preValidationKeys: ['projectItems', 'technologyUse'],
            preValidationAnswer: ['project-items-A3'],
            preValidationRule: 'SPECIFICANDANY',
            preValidationUrls: ['project-items', 'technology-use']
          },
          url: 'labour-replaced',
          baseUrl: 'labour-replaced',
          backUrl: 'technology-use',
          nextUrl: 'score',
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '<ul class="govuk-list govuk-list--bullet govuk-!-font-size-16"><li>Replace manual labour</li></ul>',
          type: 'single-answer',
          scheme: 'robotics',
          score: {
            isScore: true,
            isDisplay: true
          },
          classes: 'govuk-radios govuk-fieldset__legend--l',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Manual labour shortage',
              content: [{
                para: 'Using robotic or automatic technologies can reduce the need to find manual labour.',
                items: []
              }],
              

            }]
          },
          validate: [
            {
              type: 'NOT_EMPTY',
              error: 'Select how much manual labour the technology will replace'
            }
          ],
          answers: [
            {
              key: 'labour-replaced-A1',
              value: '1 to 2 jobs'
            },
            {
              key: 'labour-replaced-A2',
              value: '3 to 4 jobs',
            },
            {
              key: 'labour-replaced-A3',
              value: '5 or more jobs',
            },
            {
              value: 'divider'
            },
            {
              key: 'labour-replaced-A4',
              value: 'None of the above',
            }
          ],
          yarKey: 'labourReplaced'
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
              thenUrl: 'technology-use',
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
          nextUrl: 'applying',
          preValidationKeys: ['current-score'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          allFields: [
            {
              yarKey: 'projectName',
              type: 'text',
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
              type: 'text',
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
              type: 'text',
              inputmode: 'numeric',
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
              type: 'text',
              inputmode: 'numeric',
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
              type: 'text',
              inputmode: 'numeric',
              title: 'Single Business Identifier (SBI) (Optional)',
              classes: 'govuk-input govuk-input--width-10',
              label: {
                text: 'Single Business Identifier (SBI) (Optional)',
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
            dependentAnswerKeysArray: ['applicant-A2'],
            urlOptions: {
              thenUrl: 'contractors-details',
              elseUrl: 'farmers-details'
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
              redirectUrl: 'agents-details'
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
          eliminationAnswerKeys: '',
          backUrlObject: {
            dependentQuestionYarKey: ['applying'],
            dependentAnswerKeysArray: ['applying-A2'],
            urlOptions: {
              thenUrl: 'agents-details',
              elseUrl: 'applying'
            }
          },
          preValidationObject: {
            preValidationKeys: ['applicant', 'businessDetails'],
            preValidationAnswer: ['applicant-A2'],
            preValidationRule: 'NOT',
            preValidationUrls: ['applicant', 'businessDetails'],
          },
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
              type: 'text',
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
              type: 'text',
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
                text: "We'll only use this to send you confirmation"
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
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Address line 1',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your address line 1'
                },
                {
                  type: 'REGEX',
                  regex: ADDRESS_REGEX,
                  error: 'Address must only include letters, numbers, hyphens and apostrophes'
                },
              ]
            },
            {
              yarKey: 'address2',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Address line 2 (optional)',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: ADDRESS_REGEX,
                  error: 'Address must only include letters, numbers, hyphens and apostrophes'
                },
              ]
            },
            {
              yarKey: 'town',
              type: 'text',
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
              type: 'text',
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
              type: 'text',
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
          eliminationAnswerKeys: '',
          backUrlObject: {
            dependentQuestionYarKey: 'applying',
            dependentAnswerKeysArray: ['applying-A1'],
            urlOptions: {
              thenUrl: 'applying',
              elseUrl: 'agents-details'
            }
          },
          preValidationObject: {
            preValidationKeys: ['applicant', 'projectSubject'],
            preValidationAnswer: ['applicant-A1', 'project-subject-A2'],
            preValidationRule: 'NOT',
            preValidationUrls: ['applicant', 'project-subject'],
          },
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
              type: 'text',
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
              type: 'text',
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
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Address line 1',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your address line 1'
                },
                {
                  type: 'REGEX',
                  regex: ADDRESS_REGEX,
                  error: 'Address must only include letters, numbers, hyphens and apostrophes'
                },
              ]
            },
            {
              yarKey: 'address2',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Address line 2 (optional)',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: ADDRESS_REGEX,
                  error: 'Address must only include letters, numbers, hyphens and apostrophes'
                },
              ]
            },
            {
              yarKey: 'town',
              type: 'text',
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
              type: 'text',
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
              thenUrl: 'farmers-details',
              elseUrl: 'contractors-details'
            }
          },
          preValidationObject: {
            preValidationKeys: ['applying'],
            preValidationAnswer: ['applying-A2'],
            preValidationRule: 'AND',
            preValidationUrls: ['applying']
          },
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
              type: 'text',
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
              type: 'text',
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
              type: 'text',
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
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Address line 1',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Enter your address line 1'
                },
                {
                  type: 'REGEX',
                  regex: ADDRESS_REGEX,
                  error: 'Address must only include letters, numbers, hyphens and apostrophes'
                },
              ]
            },
            {
              yarKey: 'address2',
              type: 'text',
              classes: 'govuk-input--width-20',
              label: {
                text: 'Address line 2 (optional)',
                classes: 'govuk-label'
              },
              validate: [
                {
                  type: 'REGEX',
                  regex: ADDRESS_REGEX,
                  error: 'Address must only include letters, numbers, hyphens and apostrophes'
                },
              ]
            },
            {
              yarKey: 'town',
              type: 'text',
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
              type: 'text',
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
            dependentQuestionYarKey: ['applicant', 'projectSubject'],
            dependentAnswerKeysArray: ['applicant-A1', 'project-subject-A2'],
            urlOptions: {
              thenUrl: ['farmers-details', 'farmers-details'],
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
          preValidationKeys: ['applying'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Confirm and send',
            messageContent: `<ul class="govuk-list"> <li>I confirm that, to the best of my knowledge, the details I have provided are correct.</li>
            <li> I understand the project’s eligibility and estimated grant amount is based on the answers I provided.</li>
            <li> I am aware that the information I submit will be checked by the RPA.</li>
            <li> I am happy to be contacted by Defra and RPA (or third-party on their behalf) about my application.</li></ul>
            <h2 class="govuk-heading-m">Improving our schemes</h2>
            <p>So that we can continue to improve our services and schemes, we may wish to contact you in the future. Please confirm if you are happy for us, or a third-party working for us, to contact you.</p>`,
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
          preValidationKeys: ['applying', 'consentOptional'],
          ga: { name: 'confirmation', params: {} },
          maybeEligible: true,
          maybeEligibleContent: {
            reference: {
              titleText: 'Details submitted',
              html: 'Your reference number<br><strong>{{_confirmationId_}}</strong>',
              surveyLink: process.env.SURVEY_LINK
            },
            messageContentBeforeConditional: `We have sent you a confirmation email with a record of your answers.<br/><br/>
            If you do not get an email within 72 hours, contact the RPA helpline and follow the options for Farming Transformation Fund scheme.<br/><br/>`,
            messageContentPartRobotics: `<p class="govuk-body"> You can check if you can apply for a grant for <a class="govuk-link" href="${urlPrefix}/project-subject" rel="noopener noreferrer">solar project items</a>. The minimum grant is £15,000 (25% of £60,000). The maximum grant amount for both projects together is £500,000.</p>`,
            messageContentPartSolar: `<p class="govuk-body">You can check if you can apply for a grant for <a class="govuk-link" href="${urlPrefix}/project-subject" rel="noopener noreferrer">farm productivity project items</a>. The minimum grant is £25,000 (50% of £50,000). The maximum grant amount for both projects together is £500,000. </p>`,
            messageContentPostConditional: `<h2 class="govuk-heading-m">RPA helpline</h2>
            <h3 class="govuk-heading-s">Telephone</h3>
            <p class="govuk-body">Telephone: <a href="tel:0300 0200 301">0300 0200 301</a></p>
            Monday to Friday, 9am to 5pm (except public holidays)<br/>
            <p class="govuk-body"><a class="govuk-link" target="_blank" href="https://www.gov.uk/call-charges" rel="noopener noreferrer">Find out about call charges (opens in a new tab)</a></p>
            <h3 class="govuk-heading-s">Email</h3>
            <a class="govuk-link" title="Send email to RPA" target="_blank" rel="noopener noreferrer" href="mailto:ftf@rpa.gov.uk">FTF@rpa.gov.uk</a><br/><br/>
            <h2 class="govuk-heading-m">What happens next</h2>
            <ol class="govuk-list govuk-list--number">
            <li> RPA will be in touch when the full application period opens. They will tell you if your project scored well enough to get the full application form.</li>
            <li> If you submit an application, RPA will assess it against other projects and value for money. You will not automatically get a grant. The grant is expected to be highly competitive and you are competing against other projects.</li>
            <li> If your application is successful, you’ll be sent a funding agreement and can begin work on the project.</li></ol>`,
            warning: {
              text: 'You must not start the project'
            },
            extraMessageContent: `<p>Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement will invalidate your application.</p> 
            <p>Before you start the project, you can:</p>
            <ul>
              <li>get quotes from suppliers</li>
              <li>apply for planning permission</li>
            </ul>`,
            insertText: {
              text: 'If you want your landlord to underwrite your project, you should agree this with them before you begin your full application. Your landlord will need to complete a form at full application. This will confirm that they agree to take over your project, including conditions in your Grant Funding Agreement, if your tenancy ends.'
            },
            messageLink: {
              url: process.env.SURVEY_LINK,
              title: 'What do you think of this service?',
              target: '_blank'
            },
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

const YAR_KEYS = ['projectPostcode', 'remainingCost', 'projectItemsList', 'calculatedGrant', 'confirmItem'] 

ALL_QUESTIONS.forEach(question => question.yarKey && YAR_KEYS.push(question.yarKey))
module.exports = {
  questionBank,
  ALL_QUESTIONS,
  YAR_KEYS,
  ALL_URLS
}
