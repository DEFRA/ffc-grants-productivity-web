const { crumbToken } = require('./test-helper')

describe('Page: /labour-replaced', () => {
    const varList = {
        labourReplaced: '',
        technologyUse: 'Yes, we’re using it now',
        projectItems: ['Robotic and automatic technology']
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
        url: `${global.__URLPREFIX__}/labour-replaced`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('How much manual labour will this technology replace?')
    expect(response.payload).toContain('1 to 2 jobs')
    expect(response.payload).toContain('3 to 4 jobs')
    expect(response.payload).toContain('5 or more jobs')
    expect(response.payload).toContain('None of the above')
    expect(response.payload).toContain('Get your score')
})

test('should show error message if no option selected', async () => {
    const options = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/labour-replaced`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { crumb: crumbToken }
    }
const response = await global.__SERVER__.inject(options)
expect(response.statusCode).toBe(200)
expect(response.payload).toContain('Select how much manual labour the technology will replace')
})


it('should redirect to /score-summary when an option is selected', async () => {
    varList.labourReplaced = '3 to 4 jobs'
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/labour-replaced`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { labourReplaced: '3 to 4 jobs', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('score')
})


it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/labour-replaced`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"technology-use\" class=\"govuk-back-link\">Back</a>' )
    })
})
