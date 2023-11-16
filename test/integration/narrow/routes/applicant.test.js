const { crumbToken } = require('./test-helper')

const varListTemplate = {
    projectSubject: 'Farm productivity project items',
    applicant: 'Farmer',

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

describe('Check applicant page', () => {
beforeEach(() => {
    varList = { ...varListTemplate }
})

afterEach(() => {
    jest.clearAllMocks()
})

it('should load page successfully', async () => {
    const options = {
    method: 'GET',
    url: `${global.__URLPREFIX__}/applicant`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Who are you?')
    expect(response.payload).toContain('Farmer')
    expect(response.payload).toContain('Contractor')
})

it('no option selected -> show error message', async () => {
const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/applicant`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { applicant: '', crumb: crumbToken }
}

const postResponse = await global.__SERVER__.inject(postOptions)
expect(postResponse.statusCode).toBe(200)
expect(postResponse.payload).toContain('Select if you’re a farmer or a contractor')
})

it('user selects \'Farmer\' -> store user response and redirect to /legal-status', async () => {
const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/applicant`,
    headers: { cookie: 'crumb=' + crumbToken },
    payload: { applicant: 'Farmer', crumb: crumbToken }
}

const postResponse = await global.__SERVER__.inject(postOptions)
expect(postResponse.statusCode).toBe(302)
expect(postResponse.headers.location).toBe('legal-status')
})

it('user selects \'Contractor\' -> store user response and redirect to /legal-status', async () => {
    varList.applicant = 'Contractor'
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/applicant`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { applicant: 'Contractor', crumb: crumbToken }
    }
    
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('business-location')
})

it('user selects \'Farmer\' -> store user response and redirect to /legal-status', async () => {
    varList.projectSubject = 'Solar project items'
    varList.applicant = 'Farmer'
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/applicant`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { applicant: 'Farmer', crumb: crumbToken }
    }
    
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('legal-status')
})

it('user selects \'Contractor\' -> store user response and display ineligible page', async () => {
    varList.projectSubject = 'Solar project items'
    varList.applicant = 'Contractor'
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/applicant`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { applicant: 'Contractor', crumb: crumbToken }
    }
    
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
})

it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/applicant`
    }

const response = await global.__SERVER__.inject(options)
expect(response.statusCode).toBe(200)
expect(response.payload).toContain('<a href=\"project-subject\" class=\"govuk-back-link\">Back</a>')
})
})
