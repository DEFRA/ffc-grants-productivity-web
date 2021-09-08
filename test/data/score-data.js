
const msgData = {
  grantScheme: {
    key: 'PROD002',
    name: 'Prod Grant Robotics'
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
                key: 'project-subject-A1',
                value: 'Robotics and innovation'
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
        key: 'robotics-technology',
        answers: [
          {
            key: 'robotics-technology',
            title: 'Robotics Technology',
            input: [
              {
                "key": "robotics-technology-A1",
                "value": "Yes, we’re using it now"
              }
            ]
          }
        ],
        rating: {
          score: 6,
          band: 'Average'
        }
      },
      {
        key: 'robotics-data-analytics',
        answers: [
          {
            key: 'robotics-data-analytics',
            title: 'Robotics Data Analytics',
            input: [
              {
                key: 'robotics-data-analytics-A1',
                value: 'Yes, we have the technology already'
              }
            ]
          }
        ],
        rating: {
          score: 40,
          band: 'Strong'
        }
      },
      {
        key: 'robotics-data-analytics',
        answers: [
          {
            key: 'robotics-data-analytics',
            title: 'Robotics Data Analytics',
            input: [
              {
                key: 'robotics-data-analyticsa-A1',
                value: 'Yes, we have the technology already'
              }
            ]
          }
        ],
        rating: {
          score: 25,
          band: 'Strong'
        }
      },
      {
        key: 'robotics-energy-source',
        answers: [
          {
            key: 'robotics-energy-source',
            title: 'Robotics Energy Source',
            input: [
              {
                key: 'robotics-energy-source-A1',
                value: 'Electricity – derived from renewable generation on farm'
              }
            ]
          }
        ],
        rating: {
          score: 0.5,
          band: 'Weak'
        }
      },
      {
        key: 'robotics-agricultural-sector',
        answers: [
          {
            key: 'robotics-agricultural-sector',
            title: 'Robotics Agricultural Sector',
            input: [
              {
                key: 'robotics-agricultural-sector-A1',
                value: 'Horticulture'
              }
            ]
          }
        ],
        rating: {
          score: 4,
          band: 'Strong'
        }
      }
    ],
    overallRating: {
      score: 76.5,
      band: 'Strong'
    }
  },
  questionMapping: {
    projectSubject: 'project-subject',
    projectImpacts: 'project-impacts',
    dataAnalytics: 'robotics-data-analytics',
    energySource: 'robotics-energy-source',
    agriculturalSector: 'robotics-agricultural-sector',
    roboticProjectImpacts: 'waterSourcePlanned'
  }
}
module.exports = msgData
