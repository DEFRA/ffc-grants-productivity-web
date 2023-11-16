const { crumbToken } = require('./test-helper')
const { projectItemsSummaryData } = require('../../../data/projectItems-data')
const varListTemplate = {
projectItems: ['Wavelength-specific LED lighting for horticultural crops', 'Robotic and automatic technology'],
technologyItems: 'Harvesting technology',
roboticAutomatic: 'Robotic',
roboticEligibility: 'Yes',
technologyDescription: {
    description: 'some fake description some fake description'
},
projectItemsList: projectItemsSummaryData

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

describe('project-items-summary page', () => {
beforeEach(() => {
    varList = { ...varListTemplate }
    })

    afterEach(() => {
    jest.clearAllMocks()
    })

it('should load page successfully', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/project-items-summary`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Your project technology')
})


it('click continue redirects to item-conditional page', async () => {
const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/project-items-summary`,
    payload: { crumb: crumbToken },
    headers: { cookie: 'crumb=' + crumbToken }
}

const postResponse = await global.__SERVER__.inject(postOptions)
expect(postResponse.statusCode).toBe(302)
expect(postResponse.headers.location).toBe('item-conditional')
})

})
