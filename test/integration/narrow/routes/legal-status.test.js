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
describe('Legal status page', () => {
    beforeEach(() => {
        varList = { ...varListTemplate }
    })
    afterEach(() => {
        jest.clearAllMocks()
    })
    test('loads page successfully', async () => {
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/legal-status`
        }
        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('What is the legal status of the business?')
        expect(response.payload).toContain('Sole trader')
        expect(response.payload).toContain('Partnership')
        expect(response.payload).toContain('Limited company')
        expect(response.payload).toContain('Charity')
        expect(response.payload).toContain('Trust')
        expect(response.payload).toContain('Limited liability partnership')
        expect(response.payload).toContain('Community interest company')
        expect(response.payload).toContain('Limited partnership')
        expect(response.payload).toContain('Industrial and provident society')
        expect(response.payload).toContain('Co-operative society (Co-Op)')
        expect(response.payload).toContain('Community benefit society (BenCom)')
    })
    test('submits form successfully and redirects to next page', async () => {
        const options = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/legal-status`,
            headers: { cookie: 'crumb=' + crumbToken },
            payload: {
                crumb: crumbToken,
                legalStatus: 'Limited company'
            }
        }
        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('planning-permission')
    })
    test('redirects to country if user selected solar option on project-subject page', async () => {
        varList.projectSubject = 'Solar PV system'
        const options = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/legal-status`,
            headers: { cookie: 'crumb=' + crumbToken },
            payload: {
                crumb: crumbToken,
                legalStatus: 'Sole trader',
                projectSubject: 'Solar PV system'
            }
        }
        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('country')
    })
    test('shows error message if no option selected', async () => {
        const options = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/legal-status`,
            headers: { cookie: 'crumb=' + crumbToken },
            payload: {
                crumb: crumbToken,
                legalStatus: ''
            }
        }
        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('Select the legal status of the business')
    })
    // TODO: add back link tests once they're confirmed in a story
})