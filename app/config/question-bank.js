const {
  DIGITS_MAX_7,
  CHARS_MIN_10,
  CHARS_MAX_100,
  WORDS_MAX_60,
  POSTCODE_REGEX,
  WHOLE_NUMBER_REGEX,
  NUMBER_REGEX,
  NAME_ONLY_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX
} = require('../helpers/regex')

const { LIST_COUNTIES } = require('../helpers/all-counties')

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
          title: 'What is your project about?',
          pageTitle: '',
          backUrl: 'start',
          nextUrl: 'legal-status',
          url: 'project-subject',
          baseUrl: 'project-subject',
          type: 'single-answer',
          minAnswerCount: 1,
          ga: [{ journeyStart: true }],
          hint: {
            html: `
              If you want to apply for both a slurry project and a robotics project, 
              you must submit 2 separate applications.
              The maximum grant amount for both projects together is £500,000.
              <br/><br/>Select one option
            `
          },
          sidebar: null,
          validate: {
            errorEmptyField: 'Select what your project is about'
          },
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
              key: 'project-subject-A1',
              value: 'Robotics and innovation'
            },
            {
              key: 'project-subject-A2',
              value: 'Slurry acidification'
            }
          ],
          yarKey: 'projectSubject'
        },
        {
          key: 'legal-status',
          order: 20,
          title: 'What is the legal status of the business?',
          pageTitle: '',
          backUrl: 'project-subject',
          nextUrl: 'country',
          url: 'legal-status',
          baseUrl: 'legal-status',
          preValidationKeys: ['projectSubject'],
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
          validate: {
            errorEmptyField: 'Select the legal status of the business'
          },
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
          pageTitle: '',
          backUrl: 'legal-status',
          nextUrl: 'planning-permission',
          url: 'country',
          baseUrl: 'country',
          preValidationKeys: ['legalStatus'],
          ineligibleContent: {
            messageContent: 'This grant is only for projects in England.',
            insertText: { text: 'Scotland, Wales and Northern Ireland have other grants available.' },
            messageLink: {
              url: '',
              title: ''
            }
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
          validate: {
            errorEmptyField: 'Select yes if the project is in England',
            conditionalValidate: {
              errorEmptyField: 'Enter a postcode, like AA1 1AA',
              checkRegex: {
                regex: POSTCODE_REGEX,
                error: 'Enter a postcode, like AA1 1AA'
              }
            }
          },
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
              key: 'country-A1',
              conditional: true,
              value: 'Yes'
            },
            {
              key: 'country-A2',
              value: 'No',
              notEligible: true
            }
          ],
          yarKey: 'inEngland',
          conditionalKey: 'projectPostcode',
          conditionalLabelData: 'What is the site postcode?<br/><br/> Postcode'
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
          preValidationKeys: ['inEngland'],
          ineligibleContent: {
            messageContent: 'Any planning permission must be in place by 31 May 2022 (the end of the application window).',
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
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
                para: 'Any planning permission must be in place by 31 May 2022 (the end of the application window).',
                items: []
              }]
            }]
          },
          validate: {
            errorEmptyField: 'Select when the project will have planning permission'
          },
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
              key: 'planning-permission-A1',
              value: 'Not needed'
            },
            {
              key: 'planning-permission-A2',
              value: 'Secured'
            },
            {
              key: 'planning-permission-A3',
              value: 'Should be in place by 31 May 2022',
              redirectUrl: 'planning-required-condition'
            },
            {
              key: 'planning-permission-A4',
              value: 'Will not be in place by 31 May 2022',
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
            messageContent: 'Any planning permission must be in place by 31 May 2022 (the end of the application window).'
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
                items: ['get quotes from suppliers', 'apply for planning permission (this can take a long time)']
              }]
            }]
          },
          validate: {
            errorEmptyField: 'Select the option that applies to your project'
          },
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
                text: 'For example, digging, signing contracts, placing orders'
              },
              notEligible: true
            },
            {
              key: 'project-start-A3',
              value: 'No, we have not done any work on this project yet'
            }
          ],
          yarKey: 'projectStart'

        },
        {
          key: 'tenancy',
          order: 60,
          title: 'Is the planned project on land the farm business owns?',
          pageTitle: '',
          url: 'tenancy',
          baseUrl: 'tenancy',
          backUrl: 'project-start',
          preValidationKeys: ['projectStart'],
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A1'],
            urlOptions: {
              thenUrl: 'robotics/project-items',
              elseUrl: 'slurry/mild-acidification-infrastructure'
            }
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
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
          validate: {
            errorEmptyField: 'Select yes if the planned project is on land the farm business owns'
          },
          validations: [],
          answers: [
            {
              key: 'tenancy-A1',
              value: 'Yes'
            },
            {
              key: 'tenancy-A2',
              value: 'No',
              redirectUrl: 'tenancy-length'
            }
          ],
          yarKey: 'tenancy'
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
              elseUrl: 'slurry/mild-acidification-infrastructure'
            }
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
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
          validate: {
            errorEmptyField: 'Select yes if the land has a tenancy agreement in place until 2026 or after'
          },
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
              elseUrl: 'slurry/mild-acidification-infrastructure'
            }
          },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'You will need to extend your tenancy agreement before you can complete a full application.'
          }
        },
        {
          key: 'mild-acidification-infrastructure',
          order: 80,
          title: 'Will your project buy mild acidification equipment?',
          pageTitle: '',
          url: 'slurry/mild-acidification-infrastructure',
          baseUrl: 'mild-acidification-infrastructure',
          preValidationKeys: ['projectStart'],
          backUrlObject: {
            dependentQuestionYarKey: 'tenancy',
            dependentAnswerKeysArray: ['tenancy-A2'],
            urlOptions: {
              thenUrl: '/productivity/tenancy-length',
              elseUrl: '/productivity/tenancy'
            }
          },
          nextUrl: 'acidification-infrastructure',
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'Your project must buy the mild acidification equipment required for:',
                items: ['introducing acidification the first time ', 'adding additional acidification installations']
              }]
            }],
            details: {
              summaryText: 'Items included as mild acidification equipment',
              html: '<ul class="govuk-list govuk-list--bullet"><li>acid storage</li><li>dosing equipment</li><li>mixing tank</li><li>pump</li></ul>'
            }
          },
          ineligibleContent: {
            messageContent: `
              <span>Your project must buy all 4 of the following mild acidification equipment: </span>
              <ul class="govuk-body">
                <li>acid storage </li>
                <li>dosing equipment </li>
                <li>mixing tank </li>
                <li>pump</li>
              </ul>`,
            insertText: {
              html: `<span>This mild acidification equipment is required for:</span>
              <ul>
                <li>introducing acidification the first time </li>
                <li>adding additional acidification installations</li>
                </ul>`
            },
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          hint: {
            html: `<span>Your project must buy all 4 of the following mild acidification equipment:</span>
            <ul>
              <li>acid storage</li>
              <li>dosing equipment</li>
              <li>mixing tank</li>
              <li>pump</li>
            </ul>`
          },
          validate: {
            errorEmptyField: 'Select yes if you will be buying mild acidification equipment'
          },
          validations: [],
          answers: [
            {
              key: 'mild-acidification-infrastructure-A1',
              text: 'Yes, we will buy all 4 items',
              value: ['acid storage', 'dosing equipment', 'mixing tank', 'pump']
            },
            {
              key: 'mild-acidification-infrastructure-A2',
              value: 'No, we will not buy all 4 items',
              notEligible: true
            }
          ],
          yarKey: 'projectItems'

        },
        {
          key: 'acidification-infrastructure',
          order: 81,
          title: 'Does you project also need acidification infrastructure?',
          hint: {
            text: 'Any work to adapt or install pipework, pumps etc to get slurry into the acidification system and then out to storage.'
          },
          pageTitle: '',
          url: 'slurry/acidification-infrastructure',
          baseUrl: 'acidification-infrastructure',
          backUrl: 'mild-acidification-infrastructure',
          nextUrl: 'slurry-application',
          preValidationKeys: ['projectItems'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          maxAnswerCount: 3,
          validate: {
            errorEmptyField: 'Select yes if you need acidification infrastructure'
          },
          validations: [],
          answers: [
            {
              key: 'acidification-infrastructure-A1',
              text: 'Yes, we will buy acidification infrastructure',
              value: 'acidification infrastructure'
            },
            {
              key: 'acidification-infrastructure-A2',
              value: 'No, we don’t need it'
            }
          ],
          yarKey: 'acidificationInfrastructure'
        },
        {
          key: 'slurry-application',
          order: 82,
          title: 'Will you be using low-emission precision application equipment?',
          pageTitle: '',
          url: 'slurry/slurry-application',
          baseUrl: 'slurry-application',
          backUrl: 'acidification-infrastructure',
          nextUrl: 'project-cost',
          preValidationKeys: ['acidificationInfrastructure'],
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: 'You cannot apply for a grant if you will not be using low emission precision application equipment.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          hint: {
            text: 'For example, shallow injection, trailing shoe or dribble bar'
          },
          validate: {
            errorEmptyField: 'Select the option that describes your use of low-emission precision equipment'
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'You must use low-emission precision application equipment.',
                items: []
              }]
            }]
          },
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
              key: 'slurry-application-A1',
              value: 'Yes, I already have the equipment'
            },
            {
              key: 'slurry-application-A2',
              value: 'Yes, I will be purchasing the equipment as part of the project'
            },
            {
              key: 'slurry-application-A3',
              value: 'Yes, I will be using a contractor with low-emissions precision application equipment'
            },

            {
              value: 'divider'
            },
            {
              key: 'slurry-application-A4',
              value: 'No, I won’t be using the equipment',
              notEligible: true
            }
          ],
          yarKey: 'slurryApplication'
        },
        {
          key: 'project-cost',
          order: 90,
          pageTitle: '',
          url: 'slurry/project-cost',
          baseUrl: 'project-cost',
          backUrl: 'slurry-application',
          nextUrl: 'potential-amount',
          preValidationKeys: ['slurryApplication'],
          classes: 'govuk-input--width-10',
          id: 'projectCost',
          name: 'projectCost',
          prefix: { text: '£' },
          type: 'input',
          grantInfo: {
            minGrant: 35000,
            maxGrant: 500000,
            grantPercentage: 40
          },
          label: {
            text: 'What is the estimated cost of the items?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
              You can only apply for a grant of up to 40% of the estimated costs.
              <br/>Do not include VAT.
              <br/>The minimum grant you can apply for this project is £35,000 (40% of £87,500). The maximum grant is £500,000.
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
            values: [{
              heading: 'Items selected',
              content: [{
                para: '',
                items: []
              }]
            }],
            dependentYarKey: 'projectItems',
            dependentQuestionKey: 'mild-acidification-infrastructure'
          },
          validate: {
            errorEmptyField: 'Enter the estimated cost for the items',
            checkRegex: {
              regex: DIGITS_MAX_7,
              error: 'Enter a whole number with a maximum of 7 digits'
            }
          },
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
              key: '',
              value: ''
            }
          ],
          yarKey: 'projectCost'
        },
        {
          key: 'potential-amount',
          title: 'Potential grant funding',
          order: 91,
          url: 'slurry/potential-amount',
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
          },
          yarKey: 'calculatedGrant'
        },
        {
          key: 'remaining-costs',
          order: 110,
          title: 'Can you pay the remaining costs of £{{_remainingCost_}}?',
          pageTitle: '',
          url: 'slurry/remaining-costs',
          baseUrl: 'remaining-costs',
          backUrl: 'project-cost',
          nextUrl: 'SSSI',
          preValidationKeys: ['projectCost', 'calculatedGrant'],
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
                para: `
                  You cannot use any grant funding from government or local authorities.
                  \n\nYou can use money from the Basic Payment Scheme or agri-environment schemes such as Countryside Stewardship Scheme.
                `,
                items: []
              }]
            }]
          },
          validate: {
            errorEmptyField: 'Select yes if you can pay the remaining costs without using any other grant money'
          },
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
          key: 'slurry-SSSI',
          order: 120,
          title: 'Does the project directly impact a Site of Special Scientific Interest?',
          pageTitle: '',
          url: 'slurry/SSSI',
          baseUrl: 'SSSI',
          backUrl: 'remaining-costs',
          nextUrl: 'project-impacts',
          preValidationKeys: ['canPayRemainingCost'],
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          validate: {
            errorEmptyField: 'Select yes if the project directly impacts a Site of Special Scientific Interest'
          },
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
              key: 'slurry-SSSI-A1',
              value: 'Yes'
            },
            {
              key: 'slurry-SSSI-A2',
              value: 'No'
            }
          ],
          yarKey: 'sSSI'
        },
        {
          key: 'project-impacts',
          scheme: 'slurry',
          score: {
            isScore: true,
            isDisplay: true
          },
          order: 130,
          title: 'What impact will the project have?',
          pageTitle: '',
          url: 'slurry/project-impacts',
          baseUrl: 'project-impacts',
          backUrl: 'SSSI',
          preValidationKeys: ['sSSI'],
          hint: {
            html: '<br>Select one option<br>'
          },
          validate: {
            errorEmptyField: 'Select one option to describe the project impact'
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          fundingPriorities: '<ul><li>improve productivity</li><li>improve the environment</li><li>introduce innovation</li></ul>',
          type: 'single-answer',
          minAnswerCount: 1,
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['improve productivity', 'improve the environment', 'introduce innovation']
              }]
            }]
          },
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
              key: 'project-impacts-A1',
              value: 'Introduce acidification for the first time',
              redirectUrl: 'slurry-to-be-treated'
            },
            {
              key: 'project-impacts-A2',
              value: 'Add additional acidification installations',
              redirectUrl: 'slurry-currently-treated'
            }
          ],
          yarKey: 'projectImpacts'
        },
        {
          key: 'slurry-currently-treated',
          scheme: 'slurry',
          score: {
            isScore: false,
            isDisplay: true,
            dependentAnswerKey: {
              yarkey: 'projectImpacts',
              value: 'Add additional acidification installations'
            }
          },
          order: 140,
          pageTitle: '',
          url: 'slurry/slurry-currently-treated',
          baseUrl: 'slurry-currently-treated',
          backUrl: 'project-impacts',
          nextUrl: 'slurry-to-be-treated',
          preValidationKeys: ['projectImpacts'],
          classes: 'govuk-input--width-10',
          id: 'slurryCurrentlyTreated',
          name: 'slurryCurrentlyTreated',
          suffix: {
            html: 'm<sup>3</sup>'
          },
          type: 'input',
          label: {
            text: 'What volume of slurry or digestate do you currently acidify per year?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
              <br>Enter figure in cubic metres (m<sup>3</sup>), for example 18,000`
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          fundingPriorities: '<ul><li>improve productivity</li><li>improve the environment</li></ul>',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['improve productivity', 'improve the environment']
              }]
            }]
          },
          validate: {
            errorEmptyField: 'Enter the volume of slurry or digestate you currently acidify',
            checkRegex: {
              regex: NUMBER_REGEX,
              error: 'Volume must be a whole number'
            }
          },
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
              title: 'Current volume treated',
              key: ''
            }
          ],
          yarKey: 'slurryCurrentlyTreated'
        },
        {
          key: 'slurry-to-be-treated',
          scheme: 'slurry',
          score: {
            isScore: false,
            isDisplay: true
          },
          order: 150,
          pageTitle: '',
          url: 'slurry/slurry-to-be-treated',
          baseUrl: 'slurry-to-be-treated',
          preValidationKeys: ['projectImpacts'],
          backUrlObject: {
            dependentQuestionYarKey: 'projectImpacts',
            dependentAnswerKeysArray: ['project-impacts-A2'],
            urlOptions: {
              thenUrl: '/productivity/slurry/slurry-currently-treated',
              elseUrl: '/productivity/slurry/project-impacts'
            }
          },
          nextUrl: '/productivity/score',
          classes: 'govuk-input--width-10',
          id: 'slurryToBeTreated',
          name: 'slurryToBeTreated',
          suffix: {
            html: 'm<sup>3</sup>'
          },
          type: 'input',
          label: {
            text: 'What volume of slurry or digestate will you acidify per year?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
              <br>Enter figure in cubic metres(m<sup>3</sup>), for example 18,000`
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          fundingPriorities: '<ul><li>improve productivity</li><li>improve the environment</li></ul>',
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund projects that:',
                items: ['improve productivity', 'improve the environment', 'introduce innovation ']
              }]
            }]
          },
          validate: {
            errorEmptyField: 'Enter the volume of digestate you will acidify after the project',
            checkRegex: {
              regex: NUMBER_REGEX,
              error: 'Volume must be a number'
            }
          },
          validations: [
            {
              type: '',
              error: '',
              regEx: '',
              dependentAnswerKey: ''
            }
          ],
          answers: [{ title: 'Future volume treated' }],
          yarKey: 'slurryToBeTreated'
        },
        /// ////// ***************** ROBOTICS ************************************/////////////////////
        {
          key: 'robotics-project-items',
          order: 300,
          title: 'Which eligible items do you need for your project?',
          pageTitle: '',
          url: 'robotics/project-items',
          baseUrl: 'robotics-project-items',
          backUrlObject: {
            dependentQuestionYarKey: 'tenancy',
            dependentAnswerKeysArray: ['tenancy-A2'],
            urlOptions: {
              thenUrl: '/productivity/tenancy-length',
              elseUrl: '/productivity/tenancy'
            }
          },
          preValidationKeys: ['projectStart'],
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectItems',
            dependentAnswerKeysArray: ['robotics-project-items-A10'],
            urlOptions: {
              thenUrl: 'other-robotic-equipment',
              elseUrl: 'project-cost'
            }
          },
          id: 'roboticsProjectItems',
          name: 'roboticsProjectItems',
          hint: {
            html: `Select all the items your project needs 
              <br/><br/><span class="govuk-heading-s">Non-robotic equipment</span>`
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: '',
            messageLink: {
              url: '',
              title: ''
            }
          },
          fundingPriorities: '',
          type: 'multi-answer',
          minAnswerCount: 1,
          validate: {
            errorEmptyField: 'Select all the items your project needs'
          },
          validations: [],
          answers: [
            {
              key: 'robotics-project-items-A1',
              value: 'Advanced ventilation control units',
              hint: {
                text: 'System to control ventilation of existing horticultural and livestock buildings to reduce greenhouse gas emissions '
              }
            },
            {
              key: 'robotics-project-items-A2',
              value: 'Wavelength-specific LED lighting',
              hint: {
                html: `Wavelength-specific LED lighting to help crop growth, pest control and animal welfare 
                  <br/><br/><span class="govuk-heading-s govuk-!-margin-bottom-0 checkBoxMargin">Robotic equipment</span>
                  <div class="govuk-!-margin-bottom-4 checkBoxMargin">Autonomous farming equipment capable of sensing its environment, making decisions and performing actions </div>`
              }
            },
            {
              key: 'robotics-project-items-A3',
              value: 'Robotic sowing/planting equipment'
            },
            {
              key: 'robotics-project-items-A4',
              value: 'Robotic spraying equipment'
            },
            {
              key: 'robotics-project-items-A5',
              value: 'Robotic milking equipment'
            },
            {
              key: 'robotics-project-items-A6',
              value: 'Robotic weeding equipment'
            },
            {
              key: 'robotics-project-items-A7',
              value: 'Robotic or automatic harvesting equipment'
            },
            {
              key: 'robotics-project-items-A8',
              value: 'Robotic tractor'
            },
            {
              key: 'robotics-project-items-A9',
              value: 'Automated feeding systems'
            },
            {
              key: 'robotics-project-items-A10',
              value: 'Other robotic equipment'
            }
          ],
          yarKey: 'projectItems'
        },
        {
          key: 'other-robotic-equipment',
          order: 305,
          title: 'Does your other robotic equipment fit the eligibility criteria?',
          pageTitle: '',
          backUrl: 'project-items',
          nextUrl: 'other-robotic-conditional',
          url: 'robotics/other-robotic-equipment',
          baseUrl: 'other-robotic-equipment',
          preValidationKeys: ['projectItems'],
          ineligibleContent: {
            messageContent: 'RPA will only fund items that:',
            messageContentList: [
              'have a sensing system',
              'have a decision-making capability',
              'use actuators'
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
            <ul><li>have a sensing system</li>
            <li>have a decision-making capability</li>
            <li>use actuators (the devices that move robot joints)</li></ul>`
          },
          sidebar: {
            values: [{
              heading: 'Eligibility',
              content: [{
                para: 'RPA will consider items that:',
                items: ['have a sensing system', 'have a decision-making capability', 'use actuators (the devices that move robot joints)']
              }]
            }]
          },
          validate: {
            errorEmptyField: 'Select yes if your other robotic equipment meets the eligibility criteria',
            conditionalValidate: {
              errorEmptyField: 'Describe your other robotic equipment',
              checkRegex: {
                regex: WORDS_MAX_60,
                error: 'Description must be 60 words or fewer and use letters, numbers, apostrophes, commas or fullstops'
              }
            }
          },
          validations: [],
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
                dependentQuestionKey: 'robotics-project-items',
                dependentQuestionYarKey: 'projectItems',
                notUniqueAnswer: 'robotics-project-items-A10',
                maybeEligibleContent: {
                  nextUrl: 'project-cost',
                  messageHeader: 'Your other robotic equipment is not eligible for a grant from this scheme',
                  messageContent: `RPA will only fund items that:
                  <ul> <li>have a sensing system</li>
                  <li>have a decision-making capability</li>
                  <li>use actuators</li></ul>`,
                  customButtonText: 'Continue with eligible items'
                }

              }

            }
          ],
          yarKey: 'otherRoboticEquipment',
          conditionalKey: 'roboticEquipment',
          conditionalLabelData: 'Enter your item, including the name, a brief description and benefit to the farm'
        },
        {
          key: 'other-robotic-conditional',
          title: 'Your other robotic equipment might get a grant from this scheme',
          order: 307,
          url: 'robotics/other-robotic-conditional',
          backUrl: 'other-robotic-equipment',
          nextUrl: 'project-cost',
          preValidationKeys: ['otherRoboticEquipment'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Your other robotic equipment might get a grant from this scheme',
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
            dependentQuestionYarKey: 'projectItems',
            dependentAnswerKeysArray: ['robotics-project-items-A10'],
            urlOptions: {
              thenUrl: 'other-robotic-equipment',
              elseUrl: 'project-items'
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
                  dependentAnswerExceptThese: ['robotics-project-items-A10']
                }]
              },
              {
                heading: 'Not yet eligible items',
                content: [{
                  para: '',
                  items: [],
                  dependentAnswerOnlyThese: ['robotics-project-items-A10']
                }]
              }
            ],
            dependentYarKey: 'projectItems',
            dependentQuestionKey: 'robotics-project-items'

          },
          validate: {
            errorEmptyField: 'Enter the estimated cost for the items',
            checkRegex: {
              regex: DIGITS_MAX_7,
              error: 'Enter a whole number with a maximum of 7 digits'
            }
          },
          validations: [
            {
              type: '',
              error: '',
              regEx: '',
              dependentAnswerKey: ''
            }
          ],
          warningCondition: {
            dependentWarningQuestionKey: 'robotics-project-items',
            dependentWarningAnswerKeysArray: ['robotics-project-items-A10'],
            warning: {
              text: 'RPA will assess your other robotic equipment and whether they can fund it. There’s no guarantee your item will be funded',
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
          validate: {
            errorEmptyField: 'Select yes if you can pay the remaining costs without using any other grant money'
          },
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
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectItems',
            dependentAnswerKeysArray: ['robotics-project-items-A7', 'robotics-project-items-A5', 'robotics-project-items-A4', 'robotics-project-items-A3', 'robotics-project-items-A9'],
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
                \n\n Your project’s positive environmental benefit will be assessed full application stage.`,
                items: []
              }]
            }]
          },
          validate: {
            errorEmptyField: 'Select yes if the project will improve the productivity and profitability of your business'
          },
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
          validate: {
            errorEmptyField: 'Select whether your project will use data analytics to improve farm productivity'
          },
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
            dependentQuestionYarKey: 'projectItems',
            dependentAnswerKeysArray: ['robotics-project-items-A7', 'robotics-project-items-A5', 'robotics-project-items-A4', 'robotics-project-items-A3', 'robotics-project-items-A9'],
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
          maxAnswerCount: 2,
          hint: {
            text: 'Select up to 2 options'
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
          validate: {
            errorEmptyField: 'Select up to 2 types of energy your project will use',
            errorMaxSelect: 'Select up to 2 types of energy your project will use'
          },
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
          maxAnswerCount: 2,
          hint: {
            text: 'Select up to 2 options'
          },
          sidebar: {
            values: [{
              heading: 'Funding priorities',
              content: [{
                para: 'RPA wants to fund sectors that:',
                items: ['have significant labour shortages', 'have not received many grants in the past, such as dairy']
              }]
            }]
          },
          validate: {
            errorEmptyField: 'Select up to 2 sectors your project is in',
            errorMaxSelect: 'Select up to 2 sectors your project is in'

          },
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
          validate: {
            errorEmptyField: 'Select yes if you have used this technology on your farm'
          },
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
          validations: [],
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
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          validations: [
            {
              type: '',
              error: '',
              regEx: '',
              dependentAnswerKey: ''
            }
          ],
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
              yarKey: 'inSbi',
              conditionalKey: 'sbi',
              type: 'single-answer',
              title: 'Single Business Identifier (SBI)',
              classes: 'govuk-fieldset__legend--s',
              hint: {
                html: 'If you don\'t have an SBI, you can still apply.<br/>Select one option'
              },
              validate: [
                {
                  type: 'NOT_EMPTY',
                  error: 'Select if you have an SBI number'
                },
                {
                  dependentKey: 'sbi',
                  type: 'NOT_EMPTY',
                  error: 'SBI number must have 9 characters, like 011115678'
                },
                {
                  dependentKey: 'sbi',
                  type: 'REGEX',
                  regex: NUMBER_REGEX,
                  error: 'SBI number must have 9 characters, like 011115678'
                },
                {
                  dependentKey: 'sbi',
                  type: 'MIN_MAX_CHARS',
                  min: 9,
                  max: 9,
                  error: 'SBI number must have 9 characters, like 011115678'
                }
              ],
              answers: [
                {
                  key: 'inSbi-A1',
                  conditional: true,
                  value: 'Yes'
                },
                {
                  key: 'inSbi-A2',
                  value: 'No'
                }
              ]
            }
          ],
          yarKey: 'businessDetails',
          conditionalKey: 'sbi',
          conditionalLabelData: 'SBI number'
        },
        {
          key: 'applying',
          order: 190,
          title: 'Who is applying for this grant?',
          pageTitle: '',
          url: 'applying',
          baseUrl: 'applying',
          backUrl: 'business-details',
          preValidationKeys: ['businessDetails'],
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline govuk-fieldset__legend--l',
          minAnswerCount: 1,
          validate: {
            errorEmptyField: 'Select who is applying for this grant'
          },
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
              key: 'applying-A1',
              value: 'Farmer or contractor',
              redirectUrl: '/productivity/farmers-details'
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
          title: 'Farmer or contractor’s details',
          pageTitle: '',
          url: 'farmers-details',
          baseUrl: 'farmer-details',
          backUrl: '/productivity/applying',
          nextUrl: 'check-details',
          preValidationKeys: ['applying'],
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
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
          validations: [],
          allFields: [
            {
              yarKey: 'firstName',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                html: `
                  <span class="govuk-heading-m">Name</span><span>First name</span>
                `,
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
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: '',
                html: `
                  <span class="govuk-heading-m">Contact details</span><span>Email address</span>
                `,
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
                  error: 'Enter a landline or mobile number',
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
                  error: 'Enter a landline or mobile number',
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
              yarKey: 'address1',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                html: `
                  <span class="govuk-heading-m">Address</span><span>Building and street</span>
                `,
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
              classes: 'govuk-input--width-20'
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
          yarKey: 'farmerDetails'

        },
        {
          key: 'agents-details',
          order: 201,
          title: 'Agent’s details',
          pageTitle: '',
          url: 'agents-details',
          baseUrl: 'agents-details',
          backUrl: 'applying',
          nextUrl: 'farmers-details',
          preValidationKeys: ['applying'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-input',
          minAnswerCount: '',
          maxAnswerCount: '',
          validations: [],
          allFields: [
            {
              yarKey: 'firstName',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                html: `
                  <span class="govuk-heading-m">Name</span><span>First name</span>
                `,
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
              yarKey: 'emailAddress',
              type: 'email',
              classes: 'govuk-input--width-20',
              label: {
                text: '',
                html: `
                  <span class="govuk-heading-m">Contact details</span><span>Email address</span>
                `,
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
                  error: 'Enter a landline or mobile number',
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
                  error: 'Enter a landline or mobile number',
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
              yarKey: 'address1',
              type: 'input',
              classes: 'govuk-input--width-20',
              label: {
                html: `
                  <span class="govuk-heading-m">Address</span><span>Building and street</span>
                `,
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
              classes: 'govuk-input--width-20'
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
          baseUrl: 'check-details',
          backUrl: 'farmers-details',
          nextUrl: 'confirm',
          preValidationKeys: ['farmerDetails'],
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          pageData: {
            businessDetailsLink: 'business-details',
            agentDetailsLink: 'agents-details',
            farmerDetailsLink: 'farmers-details'
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          validations: [
            {
              type: '',
              error: '',
              regEx: '',
              dependentAnswerKey: ''
            }
          ],
          answers: []
        },
        {
          key: 'confirm',
          title: 'Confirm and send',
          order: 220,
          url: 'confirm',
          backUrl: 'check-details',
          nextUrl: 'confirmation',
          preValidationKeys: ['farmerDetails'],
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Confirm and send',
            messageContent: `<ul class="govuk-list"> <li>I confirm that, to the best of my knowledge, the details I have provided are correct.</li>
            <li> I understand the score was based on the answers I provided.</li>
            <li> I am aware the information I submit will be checked.</li>
            <li> I am happy to be contacted by Defra and RPA (or a third-party on their behalf) about my application.</li></ul>`
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
              surveyLink: 'https://defragroup.eu.qualtrics.com/jfe/form/SV_9ugumqZO9w4M20e'
            },
            messageContent: `You will get an email with a record of your answers.<br/><br/>
            If you do not get an email within 72 hours, please call the RPA helpline and follow the options for the Farming Transformation Fund scheme:<br/><br/>
            Telephone: 03000 200 301<br/>
            <br/>Monday to Friday, 9am to 5pm (except public holidays)<br/>
            <p><a class="govuk-link" target="_blank" href="https://www.gov.uk/call-charges">Find out about call charges (opens in new tab)</a></p>
            
            Email: <a class="govuk-link" target="_blank" href="mailto:ftf@rpa.gov.uk">FTF@rpa.gov.uk</a>
            
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
          validations: [],
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

const YAR_KEYS = ['projectPostcode', 'remainingCost']
ALL_QUESTIONS.forEach(question => question.yarKey && YAR_KEYS.push(question.yarKey))
module.exports = {
  questionBank,
  ALL_QUESTIONS,
  YAR_KEYS,
  ALL_URLS
}
