const scoreDataRobotics = require('../../../data/score-data')
const scoreDataSlurry = require('../../../data/score-data-slurry')
describe('Score page', () => {
  let crumCookie
  let server
  const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
  const createServer = require('../../../../app/server')
  const Wreck = require('@hapi/wreck')
  const senders = require('../../../../app/messaging/senders')
  const createMsg = require('../../../../app/messaging/create-msg')
  const varList = {
    projectSubject: 'Robotics and innovation'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (Object.keys(varList).includes(key)) return varList[key]
      else return 'Error'
    }
  }))

  beforeEach(async () => {
    global.__SERVER__.stop()
    jest.mock('../../../../app/messaging')
    jest.mock('../../../../app/messaging/senders')
    jest.mock('ffc-messaging')
    senders.sendProjectDetails = jest.fn(async function (message, id) {
      return null
    })
    createMsg.getDesirabilityAnswers = jest.fn((request) => {
      return ''
    })
    server = await createServer()
    await server.start()
  })
  it('should load page with error score not received after polling scroing service', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/robotics/technology`
      }
    }
    const wreckResponse = {
      payload: null,
      res: {
        statusCode: 202
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should load page with error unhandled response from scoring service', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/robotics/technology`
      }
    }
    const wreckResponse = {
      payload: null,
      res: {
        statusCode: 500
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should load page with error when wrong response from scoring service', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/robotics/technology`
      }
    }
    const wreckResponse = {
      payload: { desirability: null },
      res: {
        statusCode: 500
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should load page with error when can\'t connect scoring service', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/robotics/technology`
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      throw new Error('can\'t reach')
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should load page with error getScore return null', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/robotics/technology`
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return null
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should load page with success Robotics Strong', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/robotics/technology`
      }
    }
    const wreckResponse = {
      payload: scoreDataRobotics,
      res: {
        statusCode: 200
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project seems likely to be successful.'
    expect(response.payload).toContain(responseScoreMessage)
  })
  it('should load page with success Robotics Average', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/robotics/technology`
      }
    }
    scoreDataRobotics.desirability.overallRating.band = 'Average'
    const wreckResponse = {
      payload: scoreDataRobotics,
      res: {
        statusCode: 200
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project might be successful.'
    expect(response.payload).toContain(responseScoreMessage)
  })
  it('should load page with sucess Robotics Weak', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/robotics/technology`
      }
    }
    scoreDataRobotics.desirability.overallRating.band = 'Weak'
    const wreckResponse = {
      payload: scoreDataRobotics,
      res: {
        statusCode: 200
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project seems unlikely to be successful.'
    expect(response.payload).toContain(responseScoreMessage)
  })
  it('should load page with success Slurry Strong', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/slurry/slurry-to-be-treated`
      }
    }
    const wreckResponse = {
      payload: scoreDataSlurry,
      res: {
        statusCode: 200
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project seems likely to be successful.'
    expect(response.payload).toContain(responseScoreMessage)
  })
  it('redirects to project business details page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/score`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/business-details`)
  })

  afterEach(async () => {
    await server.stop()
  })
})
