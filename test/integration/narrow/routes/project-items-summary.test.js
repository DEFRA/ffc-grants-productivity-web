const { crumbToken } = require('./test-helper')
const { projectItemsSummaryData } = require('../../../data/projectItems-data')
const varListTemplate = {
projectItems: ['Wavelength-specific LED lighting for horticultural crops', 'Robotic and automatic technology'],
technologyItems: 'Harvesting technology',
roboticAutomatic: 'Robotic',
roboticEligibility: 'Yes',
technologyDescription: {
    itemName: '',
    brand: '',
    model: '',
    numberOfItems: '',
},
projectItemsList: projectItemsSummaryData,
automaticEligibility: null,
backToItemsSummary: false

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

    it('should load page successfully - 0 items, just for testing sake', async () => {
        varList.projectItemsList = []
        varList.automaticEligibility = ['Has sensing system that can understand its environment']
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/project-items-summary`
        }
    
        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
        expect(response.payload).toContain('Your project technology')
    })
it('should load page successfully - 2 items, normal access', async () => {
    varList.projectItemsList = [{
        realItem: 'hello',
        type: 'Automatic',
        description: {
            itemName: '',
            brand: '',
            model: '',
            numberOfItems: '',
        }
    },
    {
        realItem: 'hello',
        type: 'Automatic',
        description: {
            itemName: '',
            brand: '',
            model: '',
            numberOfItems: '',
        },
        criteriaScoring: ['Has sensing system that can understand its environment', 'Makes decisions and plans', 'Can control its actuators (the devices that move robotic joints)', 'Works in a continuous loop']
    }
    ]
    varList.roboticEligibility = 'No'
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/project-items-summary`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Your project technology')
})

it('should load page successfully - 5 items, backToSummary', async () => {
    varList.backToItemsSummary = true
    varList.projectItemsList = [{
        realItem: 'hello',
        type: 'Robotic',
        description: {
            itemName: '',
            brand: '',
            model: '',
            numberOfItems: '',
        },
    },
    {
        realItem: 'hello',
        type: 'Robotic',
        description: {
            itemName: '',
            brand: '',
            model: '',
            numberOfItems: '',
        },
    },
    {
        realItem: 'hello',
        type: 'Robotic',
        description: {
            itemName: '',
            brand: '',
            model: '',
            numberOfItems: '',
        },
    },
    {
        realItem: 'hello',
        type: 'Robotic',
        description: {
            itemName: '',
            brand: '',
            model: '',
            numberOfItems: '',
        },
    },
    {
        realItem: 'hello',
        type: 'Robotic',
        description: {
            itemName: '',
            brand: '',
            model: '',
            numberOfItems: '',
        },
    }]
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/project-items-summary`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Your project technology')
    // can also chekc back link too if wanted
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

let projectItemsList = [{
    realItem: 'hello',
    type: 'Robotic',
    description: {
        itemName: '',
        brand: '',
        model: '',
        numberOfItems: '',
    },
},
{
    realItem: 'hello',
    type: 'Robotic',
    description: {
        itemName: '',
        brand: '',
        model: '',
        numberOfItems: '',
    },
},
{
    realItem: 'hello',
    type: 'Robotic',
    description: {
        itemName: '',
        brand: '',
        model: '',
        numberOfItems: '',
    },
},
{
    realItem: 'hello',
    type: 'Robotic',
    description: {
        itemName: '',
        brand: '',
        model: '',
        numberOfItems: '',
    },
},
{
    realItem: 'hello',
    type: 'Robotic',
    description: {
        itemName: '',
        brand: '',
        model: '',
        numberOfItems: '',
    },
}]
it('page loads with correct back link if backToItemsSummary is false', async () => {
    varList.backToItemsSummary = false
    varList.projectItemsList = projectItemsList
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/project-items-summary`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/productivity/technology-description\" class=\"govuk-back-link\"')
})

it('page loads with correct back link if automaticEligibility has only one item and not null', async () => {
    varList.backToItemsSummary = null
    varList.automaticEligibility = ['Has sensing system that can understand its environment']
    varList.projectItemsList = projectItemsList
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/project-items-summary`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"/productivity/technology-items\" class=\"govuk-back-link\"')
})

it('Project items summary - should load start page if the projectItemsList does not have item', async () => {
    varList.projectItems = 'Advanced ventilation control units'
    varList.projectItemsList = []

    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/project-items-summary`
    }

    const getResponse = await global.__SERVER__.inject(options)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe('/productivity/start')
})
})
