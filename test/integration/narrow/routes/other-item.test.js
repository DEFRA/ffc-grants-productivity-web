const { crumbToken } = require('./test-helper')

describe('Page: /other-item', () => {
    const varList = {
        otherItem: 'randomData',
        projectItemsList: []
    }

    jest.mock('../../../../app/helpers/session', () => ({
        setYarValue: (request, key, value) => null,
        getYarValue: (request, key) => {
            if (varList[key]) return varList[key]
            else return undefined
    }
}))

it('page loads successfully, with all options', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/other-item`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Do you need to add another robotic or automatic item?')
    expect(response.payload).toContain('Yes')
    expect(response.payload).toContain('No')
    expect(response.payload).toContain('Continue')
})

it('should return error message if no option is selected', async () => {
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/other-item`,
        payload: { crumb: crumbToken },
        headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you need to add another robotic or automatic item')
})

it('should redirect to /technology-items when user selects Yes', async () => {
    varList.otherItem = 'Yes'
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/other-item`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { otherItem: 'Yes', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('technology-items')
})

it('should redirect to /item-conditional when user selects No and only chosen 1 item', async () => {
    varList.otherItem = 'No'
    varList.projectItemsList = ['item']
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/other-item`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { otherItem: 'No', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('/item-conditional')
})

it('should redirect to /project-items-summary when user selects No and chosen more than 1 option', async () => {
    varList.otherItem = 'No'
    varList.projectItemsList = ['Harvesting technology', "Weeding technology"]
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/other-item`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { otherItem: 'No', projectItemsList: ['Harvesting technology', "Weeding technology"], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('project-items-summary')
})

it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/other-item`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"technology-description\" class=\"govuk-back-link\">Back</a>' )
    })
})
