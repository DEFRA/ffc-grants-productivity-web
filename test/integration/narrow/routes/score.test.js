const scoreDataRobotics = require('../../../data/score-data')
const scoreDataSlurry = require('../../../data/score-data-slurry')
describe('Score page', () => {
  let crumCookie
  const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')

  const newSender = require('../../../../app/messaging/application')
  const createMsg = require('../../../../app/messaging/create-msg')
  const varList = {
    projectSubject: 'Robotics and innovation',
    slurryToBeTreated: 12
  }

  jest.mock('../../../../app/helpers/functions/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      console.log(key, 'key')
      if (Object.keys(varList).includes(key)) return varList[key]
      else return 'Error'
    }
  }))

  const getProdScoringSpy = jest.spyOn(newSender, 'getProdScoring').mockImplementation(() => {
    Promise.resolve(scoreDataRobotics)
  })
  const getDesirabilityAnswersSpy = jest.spyOn(createMsg, 'getDesirabilityAnswers').mockImplementation(() => {
    return {
      test: 'test'
    }
  })

  beforeEach(async () => {
    jest.mock('../../../../app/messaging')
    jest.mock('../../../../app/messaging/senders')
    jest.mock('ffc-messaging')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  it('should load page with error score can not get desirability answers', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/technology-use`
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should load page with error score not received after polling scroing service', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/technology-use`
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should load page with error unhandled response from scoring service', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/technology-use`
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should load page with error when wrong response from scoring service', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/technology-use`
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should load page with error when can\'t connect scoring service', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/technology-use`
      }
    }

    jest.spyOn(newSender, 'getProdScoring').mockImplementationOnce(() => {
      throw new Error('can\'t reach')
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should load page with error getScore return null', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/technology-use`
      }
    }

    jest.spyOn(newSender, 'getProdScoring').mockImplementationOnce(() => {
      return null
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should load page with success Robotics Strong', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/technology-use`
      }
    }

    jest.spyOn(newSender, 'getProdScoring').mockImplementationOnce(() => {
      // console.log('Spy: STRONG', JSON.stringify(scoreDataRobotics));
      return scoreDataRobotics
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project is likely to be successful.'
    expect(response.payload).toContain(responseScoreMessage)
    expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
    expect(getProdScoringSpy).toHaveBeenCalledTimes(1)
  })
  it('should load page with success Robotics Average', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/technology-use`
      }
    }
    scoreDataRobotics.desirability.overallRating.band = 'Average'

    jest.spyOn(newSender, 'getProdScoring').mockImplementationOnce(() => {
      // console.log('Spy: Average', JSON.stringify(scoreDataRobotics));
      return scoreDataRobotics
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project might be successful.'
    expect(response.payload).toContain(responseScoreMessage)
    expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
    expect(getProdScoringSpy).toHaveBeenCalledTimes(1)
  })
  it('should load page with sucess Robotics Weak', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/technology-use`
      }
    }
    scoreDataRobotics.desirability.overallRating.band = 'Weak'

    jest.spyOn(newSender, 'getProdScoring').mockImplementationOnce(() => {
      // console.log('Spy: WEAK', JSON.stringify(scoreDataRobotics));
      return scoreDataRobotics
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project is unlikely to be successful.'
    expect(response.payload).toContain(responseScoreMessage)
    expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
    expect(getProdScoringSpy).toHaveBeenCalledTimes(1)
  })
  it('should load page with success solar Strong', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`,
      headers: {
        referer: `${global.__URLPREFIX__}/slurry-to-be-treated`
      }
    }

    jest.spyOn(newSender, 'getProdScoring').mockImplementationOnce(() => {
      // console.log('Spy: STRONG', JSON.stringify(scoreDataSlurry));
      return scoreDataSlurry
    })

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project is likely to be successful.'
    expect(response.payload).toContain(responseScoreMessage)
    expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
    expect(getProdScoringSpy).toHaveBeenCalledTimes(1)
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

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/business-details`)
  })
})
