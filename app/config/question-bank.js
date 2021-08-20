const { DIGITS_MAX_7, POSTCODE_REGEX, NUMBER_REGEX } = require('../helpers/regex')

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
          order: 10,
          title: 'What is your project about?',
          pageTitle: '',
          backUrl: 'start',
          nextUrl: 'legal-status',
          url: 'project-subject',
          baseUrl: 'project-subject',
          type: 'single-answer',
          classes: '',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
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
          classes: '',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar: {
            heading: 'Eligibility',
            para: 'Public organisations and local authorities cannot apply for this grant.',
            items: []
          },
          validate: {
            errorEmptyField: 'Select the legal status of the farm business'
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
          classes: '',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar: {
            heading: 'Eligibility',
            para: 'This grant is only for projects in England. \n \n Scotland, Wales and Northern Ireland have other grants available.',
            items: []
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
          conditionalKey: 'projectPostcode'
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
          ineligibleContent: {
            messageContent: 'Any planning permission must be in place by 31 March 2022 (the end of the application window).',
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          classes: '',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar:
          {
            heading: 'Eligibility',
            para: 'Any planning permission must be in place by 31 March 2022 (the end of the application window).',
            items: []
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
              key: 'planning-permission-A2',
              value: 'Should be in place by 31 March 2022',
              redirectUrl: 'planning-required-condition'
            },
            {
              key: 'planning-permission-A2',
              value: 'Will not be in place by 31 March 2022',
              notEligible: true
            }
          ],
          yarKey: 'planningPermission'
        },
        {
          key: 'planning-required-condition',
          order: 91,
          url: 'planning-required-condition',
          backUrl: 'planning-permission',
          nextUrl: 'project-start',
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'Any planning permission must be in place by 31 March 2022 (the end of the application window).'
          }
        },
        {
          key: 'project-start',
          order: 50,
          title: 'Have you already started work on the project?',
          pageTitle: '',
          url: 'project-start',
          baseUrl: 'project-start',
          backUrl: 'planning-permission',
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
          classes: '',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar:
          {
            heading: 'Eligibility',
            para: 'You will invalidate your application if you start the project or commit to any costs (such as placing orders) before you receive a funding agreement.\n \n Before you start the project, you can:',
            items: ['get quotes from suppliers', 'apply for planning permissions (this can take a long time)']
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
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A1'],
            urlOptions: {
              thenUrl: 'robotics/project-purchase',
              elseUrl: 'slurry/project-items'
            }
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'single-answer',
          classes: 'govuk-radios--inline',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar:
          {
            heading: 'Eligibility',
            para: 'The land must be owned or have a tenancy in place until 2026 before starting the project.',
            items: []
          },
          validate: {
            errorEmptyField: 'Select yes if the planned project is on land the farm business owns'
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
          title: 'Do you have a tenancy agreement until 2026 or after?',
          pageTitle: '',
          url: 'tenancy-length',
          baseUrl: 'tenancy-length',
          backUrl: 'tenancy',
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A1'],
            urlOptions: {
              thenUrl: 'robotics/project-purchase',
              elseUrl: 'slurry/project-items'
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
          classes: 'govuk-radios--inline',
          ga: { dimension: '', value: '' },
          sidebar:
          {
            heading: 'Eligibility',
            para: 'The land must be owned or have a tenancy in place until 2026 before starting the project.',
            items: []
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
          order: 71,
          url: 'tenancy-length-condition',
          backUrl: 'tenancy-length',
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A1'],
            urlOptions: {
              thenUrl: 'robotics/project-purchase',
              elseUrl: 'slurry/project-items'
            }
          },
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'You will need to extend your tenancy agreement before you can complete a full application.'
          }
        },
        {
          key: 'project-items',
          order: 80,
          title: 'Which eligible items do you need for your project?',
          pageTitle: '',
          url: 'slurry/project-items',
          baseUrl: 'project-items',
          backUrl: '/productivity/tenancy-length',
          backUrlObject: {
            dependentQuestionYarKey: 'tenancy',
            dependentAnswerKeysArray: ['tenancy-A2'],
            urlOptions: {
              thenUrl: '/productivity/tenancy-length',
              elseUrl: '/productivity/tenancy'
            }
          },
          nextUrl: 'slurry-application',
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
          type: 'multi-answer',
          minAnswerCount: 1,
          hint: {
            html: `
              The minimum grant you can claim is £35,000 (40% of £87,500). The maximum grant is £500,000.
              <br/><br/>Select all that apply.`
          },
          ga: { dimension: '', value: '' },
          validate: {
            errorEmptyField: 'Select all the items your project needs'
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
              key: 'project-items-A1',
              value: 'Mild acidification equipment',
              hint: {
                html: `<span>You must buy all 4 of the following items:</span>
                <ul>
                  <li>acid storage</li>
                  <li>dosing equipment</li>
                  <li>mixing tank</li>
                  <li>pump</li>
                </ul>
                `
              },
              mustSelect: true,
              errorMustSelect: 'You must select mild acidification equipment'
            },
            {
              key: 'project-items-A2',
              value: 'Acidification infrastructure',
              hint: {
                text: 'Any work to adapt or install pipework, pumps etc to get slurry into the acidification system and then out to storage.'
              }
            }
          ],
          yarKey: 'projectItems'

        },
        {
          key: 'slurry-application',
          order: 81,
          title: 'Will you be using low-emission precision application equipment?',
          pageTitle: '',
          url: 'slurry/slurry-application',
          baseUrl: 'slurry-application',
          backUrl: 'project-items',
          nextUrl: 'project-cost',
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
          maxAnswerCount: 3,
          hint: {
            text: 'For example, shallow injection, trailing shoe or dribble bar'
          },
          ga: { dimension: '', value: '' },
          validate: {
            errorEmptyField: 'Select the option that describes your use of low-emission precision equipment'
          },
          sidebar: {
            heading: 'Eligibility',
            para: 'You must use low-emission precision application equipment.',
            items: []
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
              value: 'Yes, I will be using a contractor'
            },

            {
              value: 'divider'
            },
            {
              key: 'slurry-application-A4',
              value: 'No. I won’t be using the equipment',
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
          classes: 'govuk-input--width-10',
          id: 'projectCost',
          name: 'projectCost',
          prefix: { text: '£' },
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
          type: 'input',
          sidebar: {
            heading: 'Items selected',
            para: '',
            items: [],
            dependentYarKey: 'projectItems'
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
          order: 91,
          url: 'slurry/potential-amount',
          backUrl: 'project-cost',
          nextUrl: 'remaining-costs',
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
          order: 110,
          title: 'Can you pay the remaining costs of £{{_remainingCost_}}?',
          pageTitle: '',
          url: 'slurry/remaining-costs',
          baseUrl: 'remaining-costs',
          backUrl: 'project-cost',
          nextUrl: 'SSSI',
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
          classes: 'govuk-radios--inline',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar: {
            heading: 'Eligibility',
            para: `
              You cannot use any grant funding from government or local authorities.
              \n\nYou can use money from the Basic Payment Scheme or agri-environment schemes such as Countryside Stewardship Scheme.
            `,
            items: []
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
          classes: 'govuk-radios--inline',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
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
          yarKey: 'slurrySSSI'
        },
        {
          key: 'project-impacts',
          order: 130,
          title: 'What impact will the project have?',
          pageTitle: '',
          url: 'slurry/project-impacts',
          baseUrl: 'project-impacts',
          backUrl: 'SSSI',
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
          fundingPriorities: '',
          type: 'single-answer',
          classes: '',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar:
          {
            heading: 'Funding priorities',
            para: 'RPA wants to fund projects that:',
            items: ['improve productivity', 'improve the environment', 'introduce innovation']
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
          order: 140,
          pageTitle: '',
          url: 'slurry/slurry-currently-treated',
          baseUrl: 'slurry-currently-treated',
          backUrl: 'project-impacts',
          nextUrl: 'slurry-to-be-treated',
          classes: 'govuk-input--width-5',
          id: 'slurryCurrentlyTreated',
          name: 'slurryCurrentlyTreated',
          suffix: {
            html: 'm<sup>3</sup>'
          },
          label: {
            text: 'What volume of slurry or digestate do you currently acidify per year?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
              <br>Enter figure in cubic metres, for example 1500`
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
          type: 'input',
          ga: { dimension: '', value: '' },
          sidebar:
          {
            heading: 'Funding priorities',
            para: 'RPA wants to fund projects that:',
            items: ['improve productivity', 'improve the environment']
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
              key: ''
            }
          ],
          yarKey: 'slurryCurrentlyTreated'

        },
        {
          key: 'slurry-to-be-treated',
          order: 150,
          pageTitle: '',
          url: 'slurry/slurry-to-be-treated',
          baseUrl: 'slurry-to-be-treated',
          backUrlObject: {
            dependentQuestionYarKey: 'projectImpacts',
            dependentAnswerKeysArray: ['project-impacts-A2'],
            urlOptions: {
              thenUrl: '/productivity/slurry/slurry-currently-treated',
              elseUrl: '/productivity/slurry/project-impacts'
            }
          },
          nextUrl: '/productivity/answers',
          classes: 'govuk-input--width-5',
          id: 'slurryToBeTreated',
          name: 'slurryToBeTreated',
          suffix: {
            html: 'm<sup>3</sup>'
          },
          label: {
            text: 'What volume of slurry or digestate will you acidify per year?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
              <br>Enter figure in cubic metres, for example 1500`
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
          type: 'input',
          ga: { dimension: '', value: '' },
          sidebar:
          {
            heading: 'Funding priorities',
            para: 'RPA wants to fund projects that:',
            items: ['improve productivity', 'improve the environment', 'introduce innovation ']
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
          answers: [],
          yarKey: 'slurryToBeTreated'

        },
        /// ////// ***************** ROBOTICS ************************************/////////////////////
        {
          key: 'project-purchase',
          order: 290,
          title: 'What type of new technology does your project need?',
          pageTitle: '',
          url: 'robotics/project-purchase',
          baseUrl: 'project-purchase',
          backUrlObject: {
            dependentQuestionYarKey: 'tenancy',
            dependentAnswerKeysArray: ['tenancy-A2'],
            urlOptions: {
              thenUrl: '/productivity/tenancy-length',
              elseUrl: '/productivity/tenancy'
            }
          },
          nextUrl: 'project-items',
          classes: '',
          id: 'projectPurchase',
          name: 'projectPurchase',
          hint: {
            text: 'Equipment must be for activities in the crop-growing cycle or livestock husbandry'
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: 'Your cannot apply for a grant if your project does not include the purchase of robotic or innovative technology.',
            messageLink: {
              url: 'https://www.gov.uk/government/collections/rural-payments-and-grants',
              title: 'See other grants you may be eligible for.'
            }
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar:
          {
            heading: 'Eligibility',
            para: `Equipment must increase the productivity of primary agricultural or horticultural practices.\n\n
            Your project’s positive environmental benefit and the increase to productivity will be assessed at full application stage.`,
            items: []
          },
          validate: {
            errorEmptyField: 'Select the type of new technology your project needs'
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
              key: 'project-purchase-A1',
              value: 'Robotic equipment'
            },
            {
              key: 'project-purchase-A2',
              value: ' Enhanced automation equipment'
            },
            {
              key: 'project-purchase-A3',
              value: 'Wavelength-controlled LED lighting',
              hint: {
                text: 'Wavelength-specific LED lighting to help crop growth, pest control and animal welfare'
              }
            },
            {
              value: 'divider'
            },
            {
              key: 'project-purchase-A4',
              value: 'None of the above',
              notEligible: true
            }
          ],
          yarKey: 'projectPurchase'

        },
        {
          key: 'robotics-project-items',
          order: 300,
          title: 'Which eligible items do you need for your project?',
          pageTitle: '',
          url: 'robotics/project-items',
          baseUrl: 'robotics-project-items',
          backUrl: 'project-purchase',
          nextUrl: 'project-cost',
          classes: '',
          id: 'roboticsProjectItems',
          name: 'roboticsProjectItems',
          hint: {
            html: `The minimum grant you can apply for is £35,000 (40% of £87,500). The maximum grant is £500,000.
            <br/> Select all the items your project needs.`
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
          ga: { dimension: '', value: '' },
          validate: {
            errorEmptyField: 'Select all the items your project needs'
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
              key: 'robotics-project-items-A1',
              value: 'Robotic or automatic harvesting equipment'
            },
            {
              key: 'robotics-project-items-A2',
              value: 'Advanced ventilation control units'
            },
            {
              key: 'robotics-project-items-A3',
              value: 'Robotic weeding equipment'
            },
            {
              key: 'robotics-project-items-A4',
              value: 'Robotic milking equipment'
            },
            {
              key: 'robotics-project-items-A5',
              value: 'Robotic spraying equipment'
            },
            {
              key: 'robotics-project-items-A6',
              value: 'Robotic sowing/planting equipment'
            },
            {
              key: 'robotics-project-items-A7',
              value: 'Automated feeding systems'
            },
            {
              key: 'robotics-project-items-A8',
              value: 'Wavelength-controlled LED lighting'
            }
          ],
          yarKey: 'projectItems'

        },
        {
          key: 'robotics-project-cost',
          order: 310,
          pageTitle: '',
          url: 'robotics/project-cost',
          baseUrl: 'project-cost',
          backUrl: 'project-items',
          nextUrl: 'potential-amount',
          classes: 'govuk-input--width-10',
          id: 'projectCost',
          name: 'projectCost',
          prefix: { text: '£' },
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
          type: 'input',
          sidebar: {
            heading: 'Items selected',
            para: '',
            items: [],
            dependentYarKey: 'projectItems'
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
          answers: [],
          yarKey: 'projectCost'

        },
        {
          key: 'robotics-potential-amount',
          order: 320,
          url: 'robotics/potential-amount',
          backUrl: 'project-cost',
          nextUrl: 'remaining-costs',
          maybeEligible: true,
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: 'You may be able to apply for a grant of up to £{{_calculatedGrant_}}, based on the estimated cost of £{{_projectCost_}}.',
            warning: {
              text: 'The project is not guaranteed to receive a grant.',
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
          classes: 'govuk-radios--inline',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar: {
            heading: 'Eligibility',
            para: `You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.\n\n

            You can use loans, overdrafts and certain other grants, such as the Basic Payment Scheme or agri-environment schemes such as the Countryside Stewardship Scheme.`,
            items: []
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
          dependantNextUrl: {
            dependentQuestionYarKey: 'projectItems',
            dependentAnswerKeysArray: ['robotics-project-items-A1', 'robotics-project-items-A4', 'robotics-project-items-A5', 'robotics-project-items-A6', 'robotics-project-items-A7'],
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
          classes: 'govuk-radios--inline',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar: {
            heading: 'Eligibility',
            para: `Your project must improve the productivity and profitability of your main agricultural or horticultural business.
            \n\n Your project’s positive environmental benefit will be assessed full application stage.`,
            items: []
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
          order: 350,
          title: 'Will your project use data analytics to improve productivity on the farm?',
          pageTitle: '',
          url: 'robotics/data-analytics',
          baseUrl: 'data-analytics',
          backUrl: 'project-impact',
          nextUrl: 'energy-source',
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'single-answer',
          classes: '',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar: {
            heading: 'Funding priorities',
            para: 'RPA wants to fund projects that:',
            items: ['improve productivity', 'introduce innovation']
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
          order: 360,
          title: 'What type of energy will you use?',
          pageTitle: '',
          url: 'robotics/energy-source',
          baseUrl: 'energy-source',
          backUrlObject: {
            dependentQuestionYarKey: 'projectItems',
            dependentAnswerKeysArray: ['robotics-project-items-A1', 'robotics-project-items-A4', 'robotics-project-items-A5', 'robotics-project-items-A6', 'robotics-project-items-A7'],
            urlOptions: {
              thenUrl: 'data-analytics',
              elseUrl: 'project-impact'
            }
          },
          nextUrl: 'agricultural-sector',
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'multi-answer',
          classes: '',
          minAnswerCount: 1,
          maxAnswerCount: 2,
          ga: { dimension: '', value: '' },
          hint: {
            text: 'Select up to 2 options'
          },
          sidebar: {
            heading: 'Funding priorities',
            para: 'RPA wants to fund projects that:',
            items: ['improve the environment', 'introduce innovation']
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
              value: 'introduce innovation'
            }
          ],
          yarKey: 'energySource'
        },
        {
          key: 'robotics-agricultural-sector',
          order: 370,
          title: 'Agreculture question',
          pageTitle: '',
          url: 'robotics/agricultural-sector',
          baseUrl: 'agricultural-sector',
          backUrl: 'energy-source',
          nextUrl: '/productivity/answers',
          eliminationAnswerKeys: '',
          ineligibleContent: {},
          fundingPriorities: '',
          type: 'single-answer',
          classes: '',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar: {
            heading: 'Funding priorities',
            para: 'RPA wants to fund projects that:',
            items: ['improve productivity', 'introduce innovation']
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
              key: 'robotics-agricultural-sector-A1',
              value: 'Yes, we have the technology already'
            },
            {
              key: 'robotics-agricultural-sector-A2',
              value: 'Yes, we’ll buy the technology as part of the project',
              hint: {
                text: 'Software licences cannot be paid for by the grant'
              }
            },
            {
              key: 'robotics-agricultural-sector-A3',
              value: 'No, we will not use any data analytics'
            }
          ],
          yarKey: ''
        },

        /// ////// ***************** ROBOTICS END  ************************************/////////////////////
        {
          key: 'answers',
          order: 160,
          title: 'Score results',
          pageTitle: 'Crops',
          url: 'answers',
          baseUrl: 'answers',
          backUrl: 'slurry-to-be-treated',
          backUrlObject: {
            dependentQuestionYarKey: 'projectSubject',
            dependentAnswerKeysArray: ['project-subject-A1'],
            urlOptions: {
              thenUrl: 'robotics/remaining-costs',
              elseUrl: 'slurry/slurry-to-be-treated'
            }
          },
          nextUrl: 'business-details',
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
          ga: { dimension: '', value: '' },
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
            },
            {
              key: '',
              value: ''
            },
            {
              key: '',
              value: ''
            },
            {
              key: '',
              value: ''
            }
          ],
          yarKey: 'answers'
        },
        {
          key: 'business-details',
          order: 180,
          title: 'Business details',
          pageTitle: 'Crops',
          url: 'business-details',
          baseUrl: 'business-details',
          backUrl: 'answers',
          nextUrl: '/productivity/applying',
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
          type: '',
          minAnswerCount: '',
          maxAnswerCount: '',
          ga: { dimension: '', value: '' },
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
            },
            {
              key: '',
              value: ''
            },
            {
              key: '',
              value: ''
            },
            {
              key: '',
              value: ''
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
          classes: 'govuk-radios--inline',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
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
              value: 'farmer',
              redirectUrl: '/productivity/farmers-details'
            },
            {
              key: 'applying-A2',
              value: 'agent',
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
          backUrl: '/productivity/applying',
          nextUrl: 'check-details',
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
          type: '',
          minAnswerCount: '',
          maxAnswerCount: '',
          ga: { dimension: '', value: '' },
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
            },
            {
              key: '',
              value: ''
            },
            {
              key: '',
              value: ''
            },
            {
              key: '',
              value: ''
            }
          ],
          yarKey: 'farmerDetails'

        },
        {
          key: 'agents-details',
          order: 201,
          title: 'Agents’s details',
          pageTitle: '',
          url: 'agents-details',
          baseUrl: 'agents-details',
          backUrl: 'applying',
          nextUrl: 'check-details',
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
          type: '',
          minAnswerCount: '',
          maxAnswerCount: '',
          ga: { dimension: '', value: '' },
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
            },
            {
              key: '',
              value: ''
            },
            {
              key: '',
              value: ''
            },
            {
              key: '',
              value: ''
            }
          ],
          yarKey: 'agentsDetails'

        },
        {
          key: 'check-details',
          order: 210,
          title: 'Check your details',
          pageTitle: '',
          url: 'check-details',
          baseUrl: 'check-details',
          backUrl: 'farmer-details',
          nextUrl: 'confirm',
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
              thenUrl: '/productivity/farmers-details',
              elseUrl: '/productivity/agents-details'
            }
          },
          fundingPriorities: '',
          type: '',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
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
            },
            {
              key: '',
              value: ''
            },
            {
              key: '',
              value: ''
            },
            {
              key: '',
              value: ''
            }
          ],
          yarKey: 'checkDetails'

        },
        {
          key: 'confirm',
          order: 220,
          url: 'confirm',
          type: '',
          backUrl: 'check-details',
          nextUrl: 'reference-number',
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
          pageTitle: 'Crops',
          url: 'reference-number',
          baseUrl: 'reference-number',
          backUrl: 'confirm',
          nextUrl: '',
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
          type: '',
          classes: '',
          minAnswerCount: 1,
          ga: { dimension: '', value: '' },
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
          yarKey: 'referenceNumber'

        }
      ]
    }
  ]
}

const ALL_QUESTIONS = []
questionBank.sections.forEach(({ questions }) => {
  ALL_QUESTIONS.push(...questions)
})

module.exports = {
  questionBank,
  ALL_QUESTIONS
}
