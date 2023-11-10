const { crumbToken } = require('./test-helper')

describe('Remove item page', () => {
    const varList = {
        confirmItem: 'Hello'
    }

    jest.mock('../../../../app/helpers/session', () => ({
        setYarValue: (request, key, value) => null,
        getYarValue: (request, key) => {
            if (varList[key]) return varList[key]
            else return undefined
        }
        }))

it('should load page successfully', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/remove-item`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Are you sure you want to remove hello?')
})
it('should store user response and redirects to project-items-summary page - Yes', async () => {
const postOptions = {
    method: 'POST',
    url: `${global.__URLPREFIX__}/remove-item`,
    payload: { removeItem: 'Yes', crumb: crumbToken },
    headers: { cookie: 'crumb=' + crumbToken }
}

const postResponse = await global.__SERVER__.inject(postOptions)
expect(postResponse.statusCode).toBe(302)
expect(postResponse.headers.location).toBe('project-items-summary')
})

it('should store user response and redirects to project-items-summary page -No', async () => {
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/remove-item`,
        payload: { removeItem: 'No', crumb: crumbToken },
        headers: { cookie: 'crumb=' + crumbToken }
    }
    
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-items-summary')
})
})
