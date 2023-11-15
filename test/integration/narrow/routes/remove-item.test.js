const { crumbToken } = require('./test-helper')
describe('Remove item page', () => {
    const varList = {
        confirmItem: 'Hello',
        removeItem: 'Yes',
        errorForRemove: 'hello',
        projectItemsList: [
            {
                item: 'hello',
                type: 'aaaaaaaa',
                index: 0
            },
            {
                item: 'hello',
                type: 'sdjfhaf',
                index: 1
            }
        ],
        index: 1

    }
    jest.mock('../../../../app/helpers/session', () => ({
        setYarValue: (request, key, value) => null,
        getYarValue: (request, key) => {
            if (varList[key]) return varList[key]
            else return undefined
        }
        }))


    it('should load page successfully - normal item', async () => {
        varList.projectItemsList = [
            {
                item: 'Harvesting technology',
                index: 1,
                type: 'Robotic'
            },
            {
                item: 'Harvesting technology',
                index: 2,
                type: 'Robotic'
            },
            {
                item: 'Other technology',
                index: 3,
                type: 'Automatic'
            }
        ]
        varList.confirmItem = 'Harvesting tech'
        varList.index = 1
        varList.errorForRemove = 'Harvesting tech'
        const Options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/remove-item`,
            payload: { crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }
        
        const response = await global.__SERVER__.inject(Options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('Are you sure you want to remove harvesting tech?')
    })

    it('should load page successfully - other robo item', async () => {
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
                type: 'Robotic'
            }
        ]
        varList.confirmItem = 'Other technology'
        varList.index = 2
        varList.errorForRemove = 'the other robotic technology'
        const Options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/remove-item`,
            payload: { crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }
        
        const response = await global.__SERVER__.inject(Options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('Are you sure you want to remove the other robotic technology?')
    })

    it('should load page successfully - other auto item', async () => {
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
        varList.confirmItem = 'Other technology'
        varList.index = 2
        varList.errorForRemove = 'the other automatic technology'
        const Options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/remove-item`,
            payload: { crumb: crumbToken },
            headers: { cookie: 'crumb=' + crumbToken }
        }
        
        const response = await global.__SERVER__.inject(Options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('Are you sure you want to remove the other automatic technology?')
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


})
