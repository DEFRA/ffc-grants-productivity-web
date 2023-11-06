const desirabilityQuestions = ['project-subject', 'data-analytics', 'energy-source', 'agricultural-sector', 'technology-use']
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
  projectImpacts: [
    {
      key: 'project-impacts',
      title: 'projectImpacts title',
      answers: {
        'project-impacts-A1': 'projectImpacts answer'
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
    }]
}

const mockUserInput = {
  projectSubject: 'project-subject-A1',
  dataAnalytics: 'data-analytics-A1',
  energySource: ['energy-source-A1', 'energy-source-A2'],
  agriculturalSectorRobotics: ['agricultural-sector-A1', 'agricultural-sector-A2'],
  roboticProjectImpacts: 'robotic-project-impacts-A1'
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
    const desirabilityQuestions = ['project-subject', 'data-analytics', 'robotics-energy-source', 'robotics-agricultural-sector', 'robotics-technology']


    beforeEach(() => {
      jest.mock('../../../../../app/messaging/scoring/content-mapping', () => ({
        desirabilityQuestions: mockQuestionContent,
        desirabilityInputQuestionMapping: {
          projectSubject: 'project-subject',
          projectImpacts: 'project-impacts',
          dataAnalytics: 'data-analytics',
          energySource: 'robotics-energy-source',
          agriculturalSectorRobotics: 'robotics-agricultural-sector',
          roboticProjectImpacts: 'robotics-project-impact'
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
      expect(questionKeys.length).toEqual(5)
      expect(questionKeys).toEqual(expect.arrayContaining(desirabilityQuestions))
    })

    test('contains the correct answers > robotics', () => {
      const questions = msg.desirability.questions
      const projectSubject = questions.find(q => q.key === 'project-subject')
      const dataAnalytics = questions.find(q => q.key === 'data-analytics')
      const energySource = questions.find(q => q.key === 'robotics-energy-source')
      const agriculturalSector = questions.find(q => q.key === 'robotics-agricultural-sector')
      const roboticProjectImpacts = questions.find(q => q.key === 'robotics-technology')

      const dataAnalyticsAnswers = dataAnalytics.answers.find(a => a.key === 'data-analytics')
      const energySourceAnswers = energySource.answers.find(a => a.key === 'robotics-energy-source')
      const agriculturalSectorAnswers = agriculturalSector.answers.find(a => a.key === 'robotics-agricultural-sector')

      expect(projectSubject.answers.length).toEqual(1)
      expect(projectSubject.answers[0].title).toEqual('Project subject')
      expect(projectSubject.answers[0].input.length).toEqual(1)
      expect(projectSubject.answers[0].input[0].value).toEqual(mockUserInput.projectSubject)

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

      expect(roboticProjectImpacts.answers.length).toEqual(1)
      expect(roboticProjectImpacts.answers[0].title).toEqual('Technology')
      expect(roboticProjectImpacts.answers[0].input.length).toEqual(1)
      expect(roboticProjectImpacts.answers[0].input[0].value).toEqual(mockUserInput.roboticProjectImpacts)
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