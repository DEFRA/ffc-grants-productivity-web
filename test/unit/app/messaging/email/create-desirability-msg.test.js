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
  agriculturalSector: [
    {
      key: 'agricultural-sector',
      title: 'agriculturalSector title',
      answers: {
        'agricultural-sector-A1': 'agriculturalSector answer 1',
        'agricultural-sector-A2': 'agriculturalSector answer 2'
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
  agriculturalSector: ['agricultural-sector-A1', 'agricultural-sector-A2'],
  projectImpacts: 'project-impacts-A1',
  technologyUse: 'technology-use-A1'
}

describe('Create desirability message', () => {
  let createMsg
  let msg

  beforeEach(() => {
    jest.mock('../../../../../app/messaging/scoring/content-mapping', () => ({
      desirabilityQuestions: mockQuestionContent,
      desirabilityInputQuestionMapping: {
        projectSubject: 'project-subject',
        projectImpacts: 'project-impacts',
        dataAnalytics: 'data-analytics',
        energySource: 'energy-source',
        agriculturalSector: 'agricultural-sector',
        projectImpact: 'project-impact',
        technologyUse: 'technology-use'
      }
    }))
    createMsg = require('../../../../../app/messaging/scoring/create-desirability-msg')
    msg = createMsg(mockUserInput)
  })

  test('adds desirability property with questions', () => {
    expect(msg.desirability).toBeDefined()
    expect(msg.desirability.questions).toBeDefined()
  })

  test('contains the correct questions', () => {
    const questionKeys = msg.desirability.questions.map(q => q.key)
    expect(questionKeys.length).toEqual(5)
    expect(questionKeys).toEqual(expect.arrayContaining(desirabilityQuestions))
  })

  test('contains the correct answers', () => {
    const questions = msg.desirability.questions
    const projectSubject = questions.find(q => q.key === 'project-subject')
    const dataAnalytics = questions.find(q => q.key === 'data-analytics')
    const energySource = questions.find(q => q.key === 'energy-source')
    const agriculturalSector = questions.find(q => q.key === 'agricultural-sector')
    const technologyUse = questions.find(q => q.key === 'technology-use')
    const dataAnalyticsAnswers = dataAnalytics.answers.find(a => a.key === 'data-analytics')
    const energySourceAnswers = energySource.answers.find(a => a.key === 'energy-source')
    const agriculturalSectorAnswers = agriculturalSector.answers.find(a => a.key === 'agricultural-sector')

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
    expect(agriculturalSectorAnswers.input.length).toEqual(mockUserInput.agriculturalSector.length)
    expect(agriculturalSectorAnswers.input).toEqual(expect.arrayContaining([expect.objectContaining({ value: mockUserInput.agriculturalSector[0] })]))
    expect(agriculturalSectorAnswers.input).toEqual(expect.arrayContaining([expect.objectContaining({ value: mockUserInput.agriculturalSector[1] })]))

    expect(technologyUse.answers.length).toEqual(1)
    expect(technologyUse.answers[0].title).toEqual('Technology')
    expect(technologyUse.answers[0].input.length).toEqual(1)
    expect(technologyUse.answers[0].input[0].value).toEqual(mockUserInput.technologyUse)
  })

  test('adds rating to each question', () => {
    const ratingObj = { score: null, band: null, importance: null }
    msg.desirability.questions.forEach(q => expect(q.rating).toMatchObject(ratingObj))
  })

  test('adds overall rating to desirability', () => {
    expect(msg.desirability.overallRating).toMatchObject({ score: null, band: null })
  })
})
