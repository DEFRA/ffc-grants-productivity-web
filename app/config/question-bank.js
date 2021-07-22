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
          order: 10,
          title: 'What is your project about?',
          pageTitle: '',
          backLink: 'start',
          nextUrl: 'legal-status',
          url: 'project-subject',
          type: 'single-answer',
          classes: '',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar: null,
          validate: {
            errorEmptyField: 'You must type in something'
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
              value: 'Robotics and innovation',
              isEligible: true
            },
            {
              key: 'project-subject-A2',
              value: 'Slurry acidification',
              isEligible: true
            }
          ],
          yarKey: 'projectSubject'
        },
        {
          key: 'legal-status',
          order: 20,
          title: 'What is your project about?',
          pageTitle: '',
          backLink: 'project-subject',
          nextUrl: 'country',
          url: 'legal-status',
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
          maxAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar: {
            heading: 'Eligibility',
            para: 'Public organisations and local authorities cannot apply for this grant.',
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
              key: 'legal-status-A1',
              value: 'Sole trader',
              isEligible: true
            },
            {
              key: 'legal-status-A2',
              value: 'Partnership',
              isEligible: true
            },
            {
              key: 'legal-status-A3',
              value: 'Limited company',
              isEligible: true
            },
            {
              key: 'legal-status-A4',
              value: 'Charity',
              isEligible: true
            },
            {
              key: 'legal-status-A5',
              value: 'Trust',
              isEligible: true
            },
            {
              key: 'legal-status-A6',
              value: 'Limited liability partnership',
              isEligible: true
            },
            {
              key: 'legal-status-A7',
              value: 'Community interest company',
              isEligible: true
            },
            {
              key: 'legal-status-A8',
              value: 'Limited partnership',
              isEligible: true
            },
            {
              key: 'legal-status-A9',
              value: 'Industrial and provident society',
              isEligible: true
            },
            {
              key: 'legal-status-A10',
              value: 'Co-operative society (Co-Op)',
              isEligible: true
            },
            {
              key: 'legal-status-A11',
              value: 'Community benefit society (BenCom)',
              isEligible: true
            },
            {
              value: 'divider'
            },
            {
              key: 'legal-status-A12',
              value: 'None of the above',
              isEligible: false
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
          backLink: 'legal-status',
          nextUrl: 'planning-permission',
          url: 'country',
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
          maxAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar: {
            heading: 'Eligibility',
            para: 'This grant is only for projects in England. \n \n Scotland, Wales and Northern Ireland have other grants available.',
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
              key: 'country-A1',
              value: 'Yes',
              isEligible: true
            },
            {
              key: 'country-A2',
              value: 'No',
              isEligible: false
            }
          ],
          yarKey: 'country'
        },
        {
          key: 'planning-permission',
          order: 40,
          title: 'Does the project have planning permission?',
          pageTitle: '',
          url: 'planning-permission',
          backLink: 'country',
          nextUrl: 'project-start',
          ineligibleContent: {
            messageContent: 'Any planning permission must be in place by 31 March 2022 (the end of the application window).',
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
          },
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'Any planning permission must be in place by 31 March 2022 (the end of the application window).'
          },
          fundingPriorities: 'Improving productivity',
          type: 'single-answer',
          classes: '',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar:
            {
              heading: 'Eligibility',
              para: 'Any planning permission must be in place by 31 March 2022 (the end of the application window).',
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
              key: 'planning-permission-A1',
              value: 'Not needed',
              isEligible: true
            },
            {
              key: 'planning-permission-A2',
              value: 'Secured',
              isEligible: true
            },
            {
              key: 'planning-permission-A2',
              value: 'Expected to have by 31 March 2022',
              isEligible: 'maybe'
            },
            {
              key: 'planning-permission-A2',
              value: 'Will not have by 31 March 2022',
              isEligible: false
            }
          ],
          yarKey: 'planningPermission'
        },
        {
          key: 'project-start',
          order: 50,
          title: 'Have you already started work on the project?',
          pageTitle: '',
          url: 'project-start',
          backLink: 'planning-permission',
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
          maxAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar:
            {
              heading: 'Eligibility',
              para: 'You will invalidate your application if you start the project or commit to any costs (such as placing orders) before you receive a funding agreement.\n \n Before you start the project, you can:',
              items: ['get quotes from suppliers', 'apply for planning permissions (this can take a long time)']
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
              },
              isEligible: true
            },
            {
              key: 'project-start-A2',
              value: 'Yes, we have begun project work',
              hint: {
                text: 'For example, digging, signing contracts, placing orders'
              },
              isEligible: false
            },
            {
              key: 'project-start-A3',
              value: 'No, we have not done any work on this project yet',
              isEligible: true
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
          backLink: 'project-start',
          nextUrl: 'tenancy-length',
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
          maxAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar:
          {
            heading: 'Eligibility',
            para: 'The land must be owned or have a tenancy in place until 2026 before starting the project.',
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
              key: 'tenancy-A1',
              value: 'Yes',
              isEligible: true
            },
            {
              key: 'tenancy-A2',
              value: 'No',
              isEligible: true
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
          backLink: 'tenancy',
          nextUrl: 'associated-works',
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: '',
            insertText: { text: '' },
            messageLink: {
              url: '',
              title: ''
            }
          },
          maybeEligibleContent: {
            messageHeader: 'You may be able to apply for a grant from this scheme',
            messageContent: 'You will need to extend your tenancy agreement before you can complete a full application.'
          },
          fundingPriorities: '',
          type: 'single-answer',
          minAnswerCount: 1,
          maxAnswerCount: 1,
          classes: 'govuk-radios--inline',
          ga: { dimension: '', value: '' },
          sidebar:
            {
              heading: 'Eligibility',
              para: 'The land must be owned or have a tenancy in place until 2026 before starting the project.',
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
              key: 'associated-works-A1',
              value: 'Yes',
              isEligible: true
            },
            {
              key: 'associated-works-A2',
              value: 'No',
              isEligible: 'maybe'
            }
          ],
          yarKey: 'tenancyLength'
        },
        {
          key: 'tenancy-length-condition',
          order: 80,
          title: 'You may be able to apply for a grant from this scheme',
          pageTitle: '',
          url: 'enancy-length-condition',
          backLink: 'tenancy-length',
          nextUrl: 'associated-works',
          type: 'single-answer',
          classes: '',
          ga: { dimension: '', value: '' },
          answers: [
            {
              key: 'tenancy-length-condition',
              value: 'You will need to extend your tenancy agreement before you can complete a full application.',
              isEligible: true
            }
          ],
          yarKey: 'tenancyLengthCondition'

        },

        {
          key: 'associated-works',
          order: 80,
          title: 'Which eligible items does your project need?',
          pageTitle: '',
          url: 'associated-works',
          backLink: 'tenancy-length',
          nextUrl: 'project-cost',
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
          maxAnswerCount: 3,
          hint: 'The minimum grant you can apply for this project is £35,000 (40% of £87,500). The maximum grant is £1 million.',
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
              key: 'associated-works-A1',
              value: 'Mild acidification equipment',
              hint: ['', ''],
              isEligible: true
            },
            {
              key: 'associated-works-A2',
              value: 'Acidification infrastructure',
              hint: '',
              isEligible: true
            },
            {
              key: 'associated-works-A3',
              value: 'Slurry pipework',
              isEligible: true
            }
          ],
          yarKey: 'associatedWorks'

        },
        {
          key: 'project-cost',
          order: 90,
          pageTitle: '',
          url: 'project-cost',
          backLink: 'associated-works',
          nextUrl: 'remaining-costs',
          classes: 'govuk-input--width-10',
          id: 'projectCost',
          grant: {
            minGrant: 35000,
            maxGrant: 1000000,
            grantPercentage: 40
          },
          name: 'projectCost',
          prefix: { text: '£' },
          label: {
            text: 'What is the estimated cost of the items?',
            classes: 'govuk-label--l',
            isPageHeading: true
          },
          hint: {
            html: `
              You can only apply for a grant of up to 40% of the estimated costs.
              <br/>Do not include VAT.
              <br/><br/>Enter amount, for example 95000`
          },
          eliminationAnswerKeys: '',
          ineligibleContent: {
            messageContent: 'You can only apply for a grant of up to 40% of the estimated costs.',
            insertText: { text: 'The minimum grant you can apply for is £35,000 (40% of £87,500). The maximum grant is £1 million.' },
            messageLink: {
              url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
              title: 'See other grants you may be eligible for.'
            }
          },
          maybeEligibleContent: {
            messageHeader: 'Potential grant funding',
            messageContent: 'You may be able to apply for a grant of up to £400,000, based on the estimated cost of £1,000,000.',
            warning: {
              text: 'The project is not guaranteed to receive a grant.',
              iconFallbackText: 'Warning'
            }
          },
          type: 'input',
          sidebar:
            { heading: 'Items selected', para: '', items: [] },
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
              value: '',
              isEligible: true
            }
          ],
          yarKey: 'projectCost'

        },
        {
          key: 'remaining-costs',
          order: 110,
          title: 'Can you pay the remaining a costs? ',
          pageTitle: '',
          url: 'remaining-costs',
          backLink: 'project-cost',
          nextUrl: 'water-SSSI',
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
          maxAnswerCount: 1,
          ga: { dimension: '', value: '' },
          sidebar:
            {
              heading: 'Eligibility',
              para: 'You cannot use public money (for example grant funding from government or local authorities) towards the project costs. \n\n  You can use loans, overdrafts and certain other grants, such as the Basic Payment Scheme or agri-environment schemes such as the Countryside Stewardship Scheme.',
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
              key: 'remaining-costs-A1',
              value: 'Yes',
              isEligible: true
            },
            {
              key: 'remaining-costs-A2',
              value: 'No',
              isEligible: false
            }
          ],
          yarKey: 'remainingCosts'

        },
        {
          key: 'water-SSSI',
          order: 120,
          title: 'Does the project directly impact a Site of Special Scientific Interest?',
          pageTitle: '',
          url: 'water-SSSI',
          backLink: 'remaining-costs',
          nextUrl: 'projects-impact',
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
          maxAnswerCount: 1,
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
              key: 'water-SSSI-A1',
              value: 'Yes',
              isEligible: true
            },
            {
              key: 'water-SSSI-A2',
              value: 'No',
              isEligible: true
            }
          ],
          yarKey: 'waterSSSI'
        },
        {
          key: 'projects-impact',
          order: 130,
          title: 'What impact will the project have?',
          pageTitle: '',
          url: 'projects-impact',
          backLink: 'water-SSSI',
          nextUrl: 'slurry-currently-treated',
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
          maxAnswerCount: 1,
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
              key: 'projects-impact-A1',
              value: 'Increase acidification',
              nextUrl: '',
              isEligible: true
            },
            {
              key: 'projects-impact-A2',
              value: 'Introduce acidification',
              nextUrl: '',
              isEligible: true
            }
          ],
          yarKey: 'projectsImpact'

        },
        {
          key: 'slurry-currently-treated',
          order: 140,
          pageTitle: '',
          url: 'slurry-currently-treated',
          backLink: 'projects-impact',
          nextUrl: 'slurry-to-be-treated',
          classes: 'govuk-input--width-5',
          id: 'slurryCurrentlyTreated',
          name: 'slurryCurrentlyTreated',
          suffix: {
            html: 'm<sup>3</sup>'
          },
          label: {
            text: 'What volume of digestate do you currently acidify per year?',
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
              isEligible: true
            }
          ],
          yarKey: 'slurryCurrentlyTreated'

        },
        {
          key: 'slurry-to-be-treated',
          order: 150,
          pageTitle: '',
          url: 'slurry-to-be-treated',
          backLink: 'slurry-currently-treated',
          nextUrl: 'answers',
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
              isEligible: true
            }
          ],
          yarKey: 'slurryToBeTreated'

        },
        {
          key: 'answers',
          order: 160,
          title: 'Score results',
          pageTitle: 'Crops',
          url: 'answers',
          backLink: 'slurry-to-be-treated',
          nextUrl: 'business',
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
          type: 'mullti-answer',
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
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            }
          ],
          yarKey: 'answers'
        },
        {
          key: 'business',
          order: 170,
          title: 'Business details',
          pageTitle: 'Crops',
          url: 'business',
          backLink: 'answers',
          nextUrl: 'applying',
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
          type: 'multiinput',
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
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            }
          ],
          yarKey: 'business'
        },
        {
          key: 'applying',
          order: 180,
          title: 'Who is applying for this grant?',
          pageTitle: '',
          url: 'applying',
          backLink: 'business',
          nextUrl: 'farmer-details',
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
          maxAnswerCount: 1,
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
              key: 'applying-A1',
              value: 'farmer',
              isEligible: true
            },
            {
              key: 'applying-A2',
              value: 'agent',
              isEligible: true
            }
          ],
          yarKey: 'applying'

        },
        {
          key: 'farmer-details',
          order: 190,
          title: 'Farmer’s details',
          pageTitle: '',
          url: 'farmer-details',
          backLink: 'applying',
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
          type: 'multiinput',
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
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            }
          ],
          yarKey: 'farmerDetails'

        },
        {
          key: 'check-details',
          order: 200,
          title: 'Check your details',
          pageTitle: '',
          url: 'check-details',
          backLink: 'farmer-details',
          nextUrl: 'consent',
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
          maxAnswerCount: 1,
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
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            },
            {
              key: '',
              value: '',
              isEligible: true
            }
          ],
          yarKey: 'checkDetails'

        },
        {
          key: 'consent',
          order: 210,
          title: 'Confirm and send',
          pageTitle: 'Crops',
          url: 'consent',
          backLink: 'check-details',
          nextUrl: 'reference-number',
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
          maxAnswerCount: 1,
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
              value: '',
              isEligible: true
            }
          ],
          yarKey: 'consent'

        },
        {
          key: 'reference-number',
          order: 210,
          title: 'Details submitted',
          pageTitle: 'Crops',
          url: 'reference-number',
          backLink: 'consent',
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
          type: 'single-answer',
          classes: '',
          minAnswerCount: 1,
          maxAnswerCount: 1,
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
              value: '',
              isEligible: true
            }
          ],
          yarKey: 'referenceNumber'

        }
      ]
    }
  ]
}
