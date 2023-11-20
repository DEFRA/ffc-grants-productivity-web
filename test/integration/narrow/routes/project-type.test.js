const { crumbToken } = require('./test-helper')
const varListTemplate = {
  farmingType: 'some fake crop',
  legalStatus: 'fale status',
  inEngland: 'Yes',
  projectStarted: 'No',
  landOwnership: 'Yes',
  projectItemsList: {
    projectEquipment: ['Boom', 'Trickle']
  },
  projectCost: '12345678'
}
let varList
const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return undefined
  }
}
jest.mock('../../../../app/helpers/session', () => mockSession)
describe('Project subject page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('loads page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-subject`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('What do you need funding for?')
    expect(response.payload).toContain('If you want to apply for both a farm productivity project and a solar project, you must submit 2 separate applications.')
    expect(response.payload).toContain('The maximum grant amount for both projects together is £500,000.')
    expect(response.payload).toContain('Select one option')
    expect(response.payload).toContain('Farm productivity project items')
    expect(response.payload).toContain('Solar project items')
  })
  test('submits form successfully', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-subject`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        crumb: crumbToken,
        projectSubject: 'Farm productivity project items'
      }
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('applicant')
  })
  test('shows error message if no option selected', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-subject`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: {
        crumb: crumbToken,
        projectSubject: ''
      }
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Select what you need funding for')
  })
})
