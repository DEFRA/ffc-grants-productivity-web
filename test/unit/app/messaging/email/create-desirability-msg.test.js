const mockQuestionContent = {
  projectSubject: [
    {
      key: 'project-subject',
      title: 'projectSubject title',
      answers: {
        'project-subject-A1': 'projectSubject answer 1',
        'project-subject-A2': 'projectSubject answer 2'
      }
    }
  ],
  dataAnalytics: [
    {
      key: 'data-analytics',
      title: 'dataAnalytics title',
      answers: {
        'data-analytics-A1': 'dataAnalytics answer',
        'data-analytics-A2': 'dataAnalytics answer'
      }
    }
  ],
  eligibilityCriteria: [
    {
      key: 'eligibility-criteria',
      title: 'eligibilityCriteria title',
      answers: {
        'eligibility-criteria-A1': 'eligibilityCriteria answer',
        'eligibility-criteria-A2': 'eligibilityCriteria answer'
      }
    }
  ],
  energySource: [
    {
      key: 'energy-source',
      title: 'energySource title',
      answers: {
        'energy-source-A1': 'energySource answer',
        'energy-sourceb-A1': 'energySource answer'
      }
    }
  ],
  agriculturalSectorRobotics: [
    {
      key: 'agricultural-sector',
      title: 'agriculturalSector title',
      answers: {
        'robotics-agricultural-sector-A1': 'agriculturalSector answer 1',
        'robotics-agricultural-sector-A2': 'agriculturalSector answer 2'
      }
    }
  ],
  projectImpacts: [
    {
      key: 'project-impacts',
      title: 'projectImpacts title',
      answers: {
        'project-impacts-A1': 'projectImpacts answer 1',
        'project-impacts-A2': 'projectImpacts answer 2'
      }
    }],
  technologyUse: [
    {
      key: 'technology-use',
      title: 'technologyUse title',
      answers: {
        'technology-use-A1': 'technologyUse answer 1',
        'technology-use-A2': 'technologyUse answer 2'
      }
    }],
  labourReplaced: [
    {
      key: 'labour-replaced',
      title: 'labourReplaced title',
      answers: {
        'labour-replaced-A1': 'labourReplaced answer 1',
        'labour-replaced-A2': 'labourReplaced answer 2'
      }
    }]
}

const mockUserInput = {
  projectSubject: 'project-subject-A1',
  dataAnalytics: 'data-analytics-A1',
  energySource: ['energy-source-A1', 'energy-source-A2'],
  agriculturalSectorRobotics: ['agricultural-sector-A1', 'agricultural-sector-A2'],
  technologyUse: 'technology-use-A1',
  labourReplaced: 'labour-replaced-A1',
  eligibilityCriteria: [['eligibility-criteria-A1', 'eligibility-criteria-A2'], ['eligibility-criteria-A1', 'eligibility-criteria-A2']]
}

const mockQuestionContentSolar = {
  projectSubject: [
    {
      key: 'project-subject',
      title: 'projectSubject title',
      answers: {
        'project-subject-A1': 'projectSubject answer 1',
        'project-subject-A2': 'Solar project items'
      }
    }
  ],
  agriculturalSectorSolar: [
    {
      key: 'agricultural-sector-solar',
      title: 'agriculturalSector title',
      answers: {
        'agricultural-sector-solar-A1': 'agriculturalSector answer 1',
        'agricultural-sector-solar-A2': 'agriculturalSector answer 2'
      }
    }
  ],
  solarTechnologies: [
    {
      key: 'solar-technologies',
      title: 'solarTechnologies title',
      answers: {
        'solar-technologies-A1': 'solarTechnologies answer 1',
        'solar-technologies-A2': 'solarTechnologies answer 2'
      }
    }
  ],
  solarOutput: [
    {
      key: 'solar-output',
      title: 'solarOutput title',
      answers: {
        'solar-output-A1': 'solarOutput answer 1',
        'solar-output-A2': 'solarOutput answer 2'
      }
    }
  ]
}

const mockUserInputSolar = {
  projectSubject: 'Solar project items',
  agriculturalSectorSolar: ['agricultural-sector-solar-A1', 'agricultural-sector-solar-A2'],
  solarTechnologies: ['solar-technologies-A1'],
  solarOutput: 'solar-output-A3'
}

describe('Create desirability message tests', () => {
  describe('Create desirability message > robotics', () => {
    let createMsg
    let msg
    const desirabilityQuestions = ['data-analytics', 'energy-source', 'agricultural-sector', 'technology-use', 'labour-replaced', 'eligibility-criteria']


    beforeEach(() => {
      jest.mock('../../../../../app/messaging/scoring/content-mapping', () => ({
        desirabilityQuestions: mockQuestionContent,
        desirabilityInputQuestionMapping: {
          projectSubject: 'project-subject',
          dataAnalytics: 'data-analytics',
          energySource: 'energy-source',
          agriculturalSectorRobotics: 'agricultural-sector',
          technologyUse: 'technology-use',
          labourReplaced: 'labour-replaced',
          eligibilityCriteria: 'eligibility-criteria'
        }
      }))
      createMsg = require('../../../../../app/messaging/scoring/create-desirability-msg')
      msg = createMsg(mockUserInput)
    })

    test('adds desirability property with questions > robotics', () => {
      expect(msg.desirability).toBeDefined()
      expect(msg.desirability.questions).toBeDefined()
    })

    test('contains the correct questions > robotics', () => {
      const questionKeys = msg.desirability.questions.map(q => q.key)
      expect(questionKeys.length).toEqual(6)
      expect(questionKeys).toEqual(expect.arrayContaining(desirabilityQuestions))
    })

    test('contains the correct answers > robotics', () => {
      const questions = msg.desirability.questions
      const dataAnalytics = questions.find(q => q.key === 'data-analytics')
      const energySource = questions.find(q => q.key === 'energy-source')
      const agriculturalSector = questions.find(q => q.key === 'agricultural-sector')
      const technologyUse = questions.find(q => q.key === 'technology-use')
      const labourReplaced = questions.find(q => q.key === 'labour-replaced')
      // const eligibilityCriteria = questions.find(q => q.key === 'eligibility-criteria')

      const dataAnalyticsAnswers = dataAnalytics.answers.find(a => a.key === 'data-analytics')
      const energySourceAnswers = energySource.answers.find(a => a.key === 'energy-source')
      const agriculturalSectorAnswers = agriculturalSector.answers.find(a => a.key === 'agricultural-sector')
      const technologyUseAnswers = technologyUse.answers.find(a => a.key === 'technology-use')
      const labourReplacedAnswers = labourReplaced.answers.find(a => a.key === 'labour-replaced')

      expect(dataAnalytics.answers.length).toEqual(1)
      expect(dataAnalyticsAnswers.title).toEqual('Data analytics')
      expect(dataAnalyticsAnswers.input.length).toEqual(1)
      expect(dataAnalyticsAnswers.input[0].value).toEqual(mockUserInput.dataAnalytics)

      expect(energySource.answers.length).toEqual(1)
      expect(energySourceAnswers.title).toEqual('Energy source')
      expect(energySourceAnswers.input.length).toEqual(mockUserInput.energySource.length)
      expect(energySourceAnswers.input[0].value).toEqual(mockUserInput.energySource[0])

      expect(agriculturalSector.answers.length).toEqual(1)
      expect(agriculturalSectorAnswers.title).toEqual('Agricultural sector')
      expect(agriculturalSectorAnswers.input.length).toEqual(mockUserInput.agriculturalSectorRobotics.length)
      expect(agriculturalSectorAnswers.input).toEqual(expect.arrayContaining([expect.objectContaining({ value: mockUserInput.agriculturalSectorRobotics[0] })]))
      expect(agriculturalSectorAnswers.input).toEqual(expect.arrayContaining([expect.objectContaining({ value: mockUserInput.agriculturalSectorRobotics[1] })]))

      expect(technologyUse.answers.length).toEqual(1)
      expect(technologyUseAnswers.title).toEqual('Technology')
      expect(technologyUseAnswers.input.length).toEqual(1)
      expect(technologyUseAnswers.input[0].value).toEqual(mockUserInput.technologyUse)

      expect(labourReplaced.answers.length).toEqual(1)
      expect(labourReplacedAnswers.title).toEqual('Labour replaced')
      expect(labourReplacedAnswers.input.length).toEqual(1)
      expect(labourReplacedAnswers.input[0].value).toEqual(mockUserInput.labourReplaced)

      // elgibility criteria not added because its evil
    })

    test('adds rating to each question > robotics', () => {
      const ratingObj = { score: null, band: null, importance: null }
      msg.desirability.questions.forEach(q => expect(q.rating).toMatchObject(ratingObj))
    })

    test('adds overall rating to desirability > robotics', () => {
      expect(msg.desirability.overallRating).toMatchObject({ score: null, band: null })
    })
  })

  describe('Create desirability message > solar', () => {
    let createMsg
    let msgSolar
    const desirabilityQuestionsSolar = ['solar-technologies', 'solar-output', 'agricultural-sector-solar']


    beforeEach(() => {
      jest.mock('../../../../../app/messaging/scoring/content-mapping', () => ({
        desirabilityQuestions: mockQuestionContentSolar,
        desirabilityInputQuestionMapping: {
          projectSubject: 'project-subject',
          agriculturalSectorSolar: 'agricultural-sector-solar',
          solarTechnologies: 'solar-technologies',
          solarOutput: 'solar-output'
        }
      }))
      createMsg = require('../../../../../app/messaging/scoring/create-desirability-msg')
      msgSolar = createMsg(mockUserInputSolar)
    })

    test('adds desirability property with questions > solar', () => {
      expect(msgSolar.desirability).toBeDefined()
      expect(msgSolar.desirability.questions).toBeDefined()
    })

    test('contains the correct questions > solar', () => {
      const questionKeys = msgSolar.desirability.questions.map(q => q.key)
      expect(questionKeys.length).toEqual(3)
      expect(questionKeys).toEqual(expect.arrayContaining(desirabilityQuestionsSolar))
    })

    test('contains the correct answers > solar', () => {
      const questions = msgSolar.desirability.questions
      const agriculturalSector = questions.find(q => q.key === 'agricultural-sector-solar')
      const solarTechnologies = questions.find(q => q.key === 'solar-technologies')
      const solarOutput = questions.find(q => q.key === 'solar-output')

      const solarTechnologiesAnswers = solarTechnologies.answers.find(a => a.key === 'solar-technologies')
      const solarOutputAnswers = solarOutput.answers.find(a => a.key === 'solar-output')
      const agriculturalSectorAnswers = agriculturalSector.answers.find(a => a.key === 'agricultural-sector-solar')

      expect(solarTechnologies.answers.length).toEqual(1)
      expect(solarTechnologiesAnswers.title).toEqual('Solar project items')
      expect(solarTechnologiesAnswers.input.length).toEqual(mockUserInputSolar.solarTechnologies.length)
      expect(solarTechnologiesAnswers.input[0].value).toEqual(mockUserInputSolar.solarTechnologies[0])

      expect(solarOutput.answers.length).toEqual(1)
      expect(solarOutputAnswers.title).toEqual('Solar Output')
      expect(solarOutputAnswers.input.length).toEqual(1)
      expect(solarOutputAnswers.input[0].value).toEqual(mockUserInputSolar.solarOutput)

      expect(agriculturalSector.answers.length).toEqual(1)
      expect(agriculturalSectorAnswers.title).toEqual('Agricultural Sector')
      expect(agriculturalSectorAnswers.input.length).toEqual(mockUserInputSolar.agriculturalSectorSolar.length)
      expect(agriculturalSectorAnswers.input).toEqual(expect.arrayContaining([expect.objectContaining({ value: mockUserInputSolar.agriculturalSectorSolar[0] })]))
      expect(agriculturalSectorAnswers.input).toEqual(expect.arrayContaining([expect.objectContaining({ value: mockUserInputSolar.agriculturalSectorSolar[1] })]))

    })

    test('adds rating to each question > solar', () => {
      const ratingObj = { score: null, band: null, importance: null }
      msgSolar.desirability.questions.forEach(q => expect(q.rating).toMatchObject(ratingObj))
    })

    test('adds overall rating to desirability > solar', () => {
      expect(msgSolar.desirability.overallRating).toMatchObject({ score: null, band: null })
    })
  })
})