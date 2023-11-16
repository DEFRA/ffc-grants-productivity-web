const { crumbToken } = require('./test-helper')

describe('Page: /item-conditional', () => {
    const varList = {
        projectItemsList: []
    }

    jest.mock('../../../../app/helpers/session', () => ({
        setYarValue: (request, key, value) => null,
        getYarValue: (request, key) => {
            if (varList[key]) return varList[key]
            else return undefined
    }
}))

it('page loads successfully', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/item-conditional`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Your technology might get a grant from this scheme')
})

it('should redirect to /project-cost when user press continue', async () => {
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/item-conditional`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-cost')
})

it('page loads with correct back link when only 1 item was selected', async () => {
    varList.projectItemsList = ['Harvesting technology']
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/item-conditional`
    }
   
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/productivity/project-items-summary\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
    })

it(`page loads with correct back link when more then 1 option was selected`, async () => {
    varList.projectItemsList = ['Harvesting technology', 'Weeding technology']
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/item-conditional`
        }

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('<a href=\"/productivity/project-items-summary\" class=\"govuk-back-link\" id=\"linkBack\">Back</a>')
        })
})
