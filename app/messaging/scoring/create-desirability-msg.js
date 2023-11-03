const grantSchemeConfig = require('./config/grant-scheme')
const { desirabilityQuestions: questionContent } = require('./content-mapping')
const { getQuestionAnswer } = require('../../helpers/utils')
const desirabilityQuestions = ['solarTechnologies', 'solarOutput', 'agriculturalSectorSolar']
const desirabilityRoboticsQuestions = ['energySource', 'agriculturalSector', 'technologyUse', 'labourReplaced', 'dataAnalytics', 'projectItemsList']

const PROJECT_SUBJECT_SOLAR = getQuestionAnswer('project-subject', 'project-subject-A2')

function getUserAnswer (answers, userInput) {
  if (answers) {
    return [userInput].flat().map(answer =>
      ({ key: Object.keys(answers).find(key => answers[key] === answer), value: answer }))
  } else {
    return [{ key: null, value: null }]
  }
}

function getDesirabilityDetails (questionKey, userInput) {
  const content = questionContent[questionKey]
  // needs to loop for eligibility-criteria for each array in answers array
  console.log('content', questionContent[questionKey], questionKey, userInput[questionKey])

  if (questionKey === 'eligibilityCriteria') {
    let loopLists = []
    for (item in userInput[questionKey]) {

      console.log('eligibility criteria item to be added', userInput[questionKey], userInput[questionKey][item])

      loopLists.push({
       answers: content.map(({ key, title, answers }) => ({
          key,
          title,
          input: getUserAnswer(answers, userInput[questionKey][item])
        })),
        rating: {
          score: null,
          band: null,
          importance: null
        }
      })
    }
    return {
      key: content[0].key,
      answers: loopLists
    }

  } else {
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
