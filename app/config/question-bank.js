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
    sections:[
        {
            name: 'eligibility',
            title: 'Eligibility',
            questions: [
                {
                  key: 'Q1',
                  order: 1,
                  title: 'What crops are you growing?',
                  pageTitle: 'Crops',
                  url: 'farming-type',
                  eliminationAnswerKeys: ["Q1-A5"],
                  ineligibleContent:{ heading:'', message:'', link:''},
                  fundingPriorities: 'Improving productivity',
                  type: 'single-answer',
                  minAnswerCount: 1,
                  maxAnswerCount:2,
                  ga: { dimension:'CD1', value:'AnswerValue'},
                  sidebar:{ heading:'', para:'',link:'', items:[] },
                  validations:[
                        {
                            type: 'answerCount',
                            error: 'Select only 2 options',
                            regEx: '',
                            dependentAnswerKey: 'Q1-A1'
                        }
                  ],
                  answers: [
                      {
                        key: 'Q1-A1',
                        value: 'Change water source',
                        isCorrect: true,
                      },
                      {
                        key: 'Q1-A2',
                        value: 'Improve irrigation efficiency',
                        isCorrect: true
                      },
                      {
                        key: 'Q1-A3',
                        value: 'Introduce Irrigation',
                        isCorrect: true
                      },
                      {
                        key: 'Q1-A4',
                        value: 'Increase Irrigation',
                        isCorrect: true
                      },
                      {
                        key: 'Q1-A5',
                        value: 'None of the above',
                        isCorrect: false
                      }
                    ]
                },                
                {
                  key: 'Q2',
                  order: 2,
                  title: 'What crops are you growing?',
                  pageTitle: 'Crops',
                  url: 'farming-type1',
                  eliminationAnswerKeys: ["Q1-A5"],
                  ineligibleContent:{ heading:'', message:'', link:''},
                  fundingPriorities: 'Improving productivity',
                  type: 'input',
                  minAnswerCount: 1,
                  maxAnswerCount:2,
                  ga: { dimension:'CD1', value:'AnswerValue'},
                  sidebar:{ heading:'', para:'',link:'', items:[] },
                  validations:[
                        {
                            type: 'answerCount',
                            error: 'Select only 2 options',
                            regEx: '',
                            dependentAnswerKey: 'Q1-A1'
                        }
                  ],
                  answers: [
                      {
                        key: 'Q1-A1',
                        value: 'Change water source',
                        isCorrect: true,
                      },
                      {
                        key: 'Q1-A2',
                        value: 'Improve irrigation efficiency',
                        isCorrect: true
                      },
                      {
                        key: 'Q1-A3',
                        value: 'Introduce Irrigation',
                        isCorrect: true
                      },
                      {
                        key: 'Q1-A4',
                        value: 'Increase Irrigation',
                        isCorrect: true
                      },
                      {
                        key: 'Q1-A5',
                        value: 'None of the above',
                        isCorrect: false
                      }
                    ]
                }    
              ]
        }
    ]    
  }
  