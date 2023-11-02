const grantSchemeConfig = require('./config/grant-scheme')
const { desirabilityQuestions: questionContent } = require('./content-mapping')
const { getQuestionAnswer } = require('../../helpers/utils')
const desirabilityQuestions = ['solarTechnologies', 'solarOutput', 'agriculturalSectorSolar']
const desirabilityRoboticsQuestions = ['projectSubject', 'dataAnalytics', 'energySource', 'agriculturalSectorRobotics', 'roboticProjectImpacts']
const PROJECT_SUBJECT_SOLAR = getQuestionAnswer('project-subject', 'project-subject-A2')

function getUserAnswer (answers, userInput) {
  if (answers) {
    return [userInput].flat().map(answer =>
      ({ key: Object.keys(answers).find(key => answers[key] === answer), value: answer }))
  } else {
    // if solar panels not selected, set solar output to 'Solar panels not chosen' for scoring
    return [{ key: 'solar-output-A6', value: 'Solar panels not chosen' }]
  }
}

function getDesirabilityDetails (questionKey, userInput) {
  const content = questionContent[questionKey]
  return {
    key: content[0].key,
    answers: content.map(({ key, title, answers }) => ({
      key,
      title,
      input: getUserAnswer(answers, userInput[questionKey])
    })),
    rating: {
      score: null,
      band: null,
      importance: null
    }
  }
}

function desirability (userInput) {
  const isSolar = userInput.projectSubject === PROJECT_SUBJECT_SOLAR
  const key = isSolar ? 'PROD01' : 'PROD02'
  const validKeys = key === 'PROD01' ? desirabilityQuestions : desirabilityRoboticsQuestions
  const grantScheme = grantSchemeConfig.filter(g => g.key === key)[0]
  const answeredQuestions = []
  validKeys.forEach(questionKey => {
    if (userInput[questionKey]) {
      answeredQuestions.push(getDesirabilityDetails(questionKey, userInput))
    }
  })
  return {
    grantScheme: {
      key: grantScheme.key,
      name: grantScheme.name
    },
    desirability: {
      questions: answeredQuestions,
      overallRating: {
        score: null,
        band: null
      }
    }
  }
}

module.exports = desirability
