const grantSchemeConfig = require('./config/grant-scheme')
const { desirabilityQuestions: questionContent } = require('./content-mapping')
const { getQuestionAnswer } = require('../../helpers/utils')
const desirabilityQuestions = ['solarTechnologies', 'solarOutput', 'agriculturalSector']
const desirabilityRoboticsQuestions = ['projectSubject', 'dataAnalytics', 'energySource', 'agriculturalSector', 'roboticProjectImpacts']
const PROJECT_SUBJECT_SOLAR = getQuestionAnswer('project-subject', 'project-subject-A2')

function getUserAnswer (answers, userInput) {
  if (answers) {
    return [userInput].flat().map(answer =>
      ({ key: Object.keys(answers).find(key => answers[key] === answer), value: answer }))
  } else {
    return [{ key: null, value: userInput }]
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
  console.log(isSolar,'-----', userInput, '---', PROJECT_SUBJECT_SOLAR)
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
