const { crumbToken } = require('./test-helper')
describe('Remove item page', () => {
    const varList = {
        confirmItem: 'Hello',
        removeItem: 'Yes',
        errorForRemove: 'hello'

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
        varList.projectItemsList = ['Hello', 'World']
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
    it('should redirects to /technology-items page - if user Yes and removed the last item', async () => {
        varList.projectItemsList = []
        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/remove-item`,
            payload: { removeItem: 'Yes', crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }
        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(302)
        expect(postResponse.headers.location).toBe(`/productivity/technology-items`)
    })
    it('should store user response and redirects to project-items-summary page -No', async () => {
        varList.removeItem = 'No'
        varList.projectItemsList = ['Hello', 'World']
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

    it('click continue redirects to remove-item page if item and index - normal item with normal error', async () => {
        varList.projectItemsList = [
            {
                item: 'Harvesting technology',
                index: 1,
                type: 'Robotic'
            },
            {
                item: 'Other technology',
                index: 2,
                type: 'Robotic'
            },
            {
                item: 'Other technology',
                index: 3,
                type: 'Automatic'
            }
        ]
        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/remove-item`,
            payload: { item: 'Harvesting technology', index: 0, crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }
        
        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(302)
        expect(postResponse.headers.location).toBe('/productivity/remove-item')
    })

    it('click continue redirects to remove-item page if item and index - ropbotic other item', async () => {
        varList.projectItemsList = [
            {
                item: 'Harvesting technology',
                index: 1,
                type: 'Robotic'
            },
            {
                item: 'Other technology',
                index: 2,
                type: 'Robotic'
            },
            {
                item: 'Other technology',
                index: 3,
                type: 'Automatic'
            }
        ]
        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/remove-item`,
            payload: { item: 'Other technology', index: 1, crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }
        
        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(302)
        expect(postResponse.headers.location).toBe('/productivity/remove-item')
    })

    it('click continue redirects to remove-item page if item and index - automatic other item', async () => {
        varList.projectItemsList = [
            {
                item: 'Harvesting technology',
                index: 1,
                type: 'Robotic'
            },
            {
                item: 'Other technology',
                index: 2,
                type: 'Robotic'
            },
            {
                item: 'Other technology',
                index: 3,
                type: 'Automatic'
            }
        ]
        const postOptions = {
            method: 'POST',
            url: `${global.__URLPREFIX__}/remove-item`,
            payload: { item: 'Other technology', index: 2, crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }
        
        const postResponse = await global.__SERVER__.inject(postOptions)
        expect(postResponse.statusCode).toBe(302)
        expect(postResponse.headers.location).toBe('/productivity/remove-item')
    })
})
