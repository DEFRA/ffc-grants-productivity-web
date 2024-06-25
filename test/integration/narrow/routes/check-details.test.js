const { crumbToken } = require('./test-helper')

const varListTemplate = {
    projectSubject: 'Solar project items',
    applicant: null,

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

describe('Check details page', () => {
beforeEach(() => {
    varList = { ...varListTemplate }
})

afterEach(() => {
    jest.clearAllMocks()
})
it('should load page successfully', async () => {
    const options = {
    method: 'GET',
    url: `${global.__URLPREFIX__}/check-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Check your details')
})
it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/check-details`
    }

const response = await global.__SERVER__.inject(options)
expect(response.statusCode).toBe(200)
expect(response.payload).toContain('<a href=\"farmers-details\" class=\"govuk-back-link\"')
})
it('page loads with correct back link', async () => {
    varList.projectSubject = 'Farm productivity project items'
    varList.applicant = 'Farmer'
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/check-details`
    }

const response = await global.__SERVER__.inject(options)
expect(response.statusCode).toBe(200)
expect(response.payload).toContain('<a href=\"farmers-details\" class=\"govuk-back-link\"')
})
it('page loads with correct back link', async () => {
    varList.projectSubject = 'Farm productivity project items'
    varList.applicant = 'Contractor'
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/check-details`
    }

const response = await global.__SERVER__.inject(options)
expect(response.statusCode).toBe(200)
expect(response.payload).toContain('<a href=\"contractors-details\" class=\"govuk-back-link\"')
})
})
