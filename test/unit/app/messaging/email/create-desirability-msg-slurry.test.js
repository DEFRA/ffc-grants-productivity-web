const desirabilityQuestions = ['project-subject', 'project-impacts']

const mockQuestionContent = {
  projectSubject: [
    {
      key: 'project-subject',
      title: 'project-subject title',
      answers: {
        'project-subject-A1': 'Robotics and Innovation',
        'project-subject-A2': 'Slurry Acidification'
      }
    }
  ],
  projectImpacts: [
    {
      key: 'project-impacts',
      title: 'project-impacts title',
      answers: {
        'project-impacts-A1': 'project-impacts answer'
      }
    }
  ]
}
const mockUserInput = {
  projectSubject: 'Slurry Acidification',
  projectImpacts: 'project-impacts-A1'
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
        dataAnalytics: 'robotics-data-analytics',
        energySource: 'robotics-energy-source',
        agriculturalSector: 'robotics-agricultural-sector',
        roboticProjectImpacts: 'robotics-project-impact'
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
    expect(questionKeys.length).toEqual(2)
    expect(questionKeys).toEqual(expect.arrayContaining(desirabilityQuestions))
  })

  test('contains the correct answers', () => {
    const questions = msg.desirability.questions
    const projectSubject = questions.find(q => q.key === 'project-subject')
    const projectImpacts = questions.find(q => q.key === 'project-impacts')
    expect(projectSubject.answers.length).toEqual(1)
    expect(projectSubject.answers[0].title).toEqual('Project subject')
    expect(projectSubject.answers[0].input.length).toEqual(1)
    expect(projectSubject.answers[0].input[0].value).toEqual(mockUserInput.projectSubject)

    expect(projectImpacts.answers.length).toEqual(1)
    expect(projectImpacts.answers[0].title).toEqual('Project impact')
    expect(projectImpacts.answers[0].input.length).toEqual(1)
    expect(projectImpacts.answers[0].input[0].value).toEqual(mockUserInput.projectImpacts)
  })

  test('adds rating to each question', () => {
    const ratingObj = { score: null, band: null, importance: null }
    msg.desirability.questions.forEach(q => expect(q.rating).toMatchObject(ratingObj))
  })

  test('adds overall rating to desirability', () => {
    expect(msg.desirability.overallRating).toMatchObject({ score: null, band: null })
  })
})
