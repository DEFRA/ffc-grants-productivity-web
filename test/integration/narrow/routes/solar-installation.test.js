const { crumbToken } = require('./test-helper')

describe('Page: /solar-installation', () => {
    let varList = {
    solarInstallation: 'randomData'
    }

    jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
        if (varList[key]) return varList[key]
        else return null
    }
}))

it('page loads successfully, with all the options', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/solar-installation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Where will you install the solar PV panels?')
    expect(response.payload).toContain('On a rooftop')
    expect(response.payload).toContain('On an existing hardstanding area')
    expect(response.payload).toContain('Floating (on a reservoir)')
    expect(response.payload).toContain('None of the above')
})

it('no option selected -> show error message', async () => {
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/solar-installation`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { solarInstallation: '', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select where you will install the solar PV panels')
})

it('user selects ineligible option: \'None of the above\' -> display ineligible page', async () => {
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/solar-installation`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { solarInstallation: 'None of the above', crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
})

it('user selects any option AND \'Solar panels\' -> store user response and redirect to /solar-installation', async () => {
    varList.solarInstallation = ['Solar panels', 'An electrical grid connection']
    const postOptions = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/solar-installation`,
        headers: { cookie: 'crumb=' + crumbToken },
        payload: { solarInstallation: ['On a rooftop', 'On an existing hardstanding area'], crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toContain('solar-output')
})

it('page loads with correct back link', async () => {
    const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/solar-installation`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"solar-technologies\" class=\"govuk-back-link\">Back</a>')
})
})
