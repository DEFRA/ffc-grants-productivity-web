
const msgData = {
  grantScheme: {
    key: 'PROD001',
    name: 'Prod Grant Slury'
  },
  desirability: {
    questions: [
      {
        key: 'project-subject',
        answers: [
          {
            key: 'project-subject',
            title: 'Project details',
            input: [
              {
                key: 'project-subject-A2',
                value: 'Slurry acidification'
              }
            ]
          }
        ],
        rating: {
          score: 1,
          band: 'Weak'
        }
      },
      {
        key: 'project-impacts',
        answers: [
          {
            key: 'project-impacts',
            title: 'Project impact',
            input: [
              {
                key: 'project-impacts-A1',
                value: 'Introducing acidification'
              }
            ]
          }
        ],
        rating: {
          score: 6,
          band: 'Average'
        }
      }
    ],
    overallRating: {
      score: 100,
      band: 'Strong'
    }
  },
  questionMapping: {
    projectSubject: 'project-subject',
    projectImpacts: 'project-impacts',
    dataAnalytics: 'robotics-data-analytics',
    energySource: 'robotics-energy-source',
    agriculturalSector: 'robotics-agricultural-sector',
    projectImpact: 'robotics-project-impact'
  }
}
module.exports = msgData
