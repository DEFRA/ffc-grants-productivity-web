
describe('Page Guard', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  it('shoud redirect to start page if the site is decommissioned', async () => {
    process.env.SERVICE_END_DATE = '2021/02/17'
    process.env.SERVICE_END_TIME = '23:59:58'
    process.env.START_PAGE_URL = 'https://www.bbc.co.uk/'


    const { startPageUrl, serviceEndDate, serviceEndTime } = require('../../../../app/config/server')
    console.log(startPageUrl, serviceEndDate, serviceEndTime)
    console.log(process.env.SERVICE_END_TIME,'EEEEEEEEE')
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-subject`
    }

    const getResponse = await global.__SERVER__.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe('/productivity/start')
  })

  // it('should redirect to start page if the user misses a journey question', async () => {
  //   const postOptions = {
  //     method: 'POST',
  //     url: `${global.__URLPREFIX__}/robotics/technology`,
  //     payload: { technology: 'some fake technology', crumb: crumbToken },
  //     headers: {
  //       cookie: 'crumb=' + crumbToken
  //     }
  //   }

  //   const postResponse = await global.__SERVER__.inject(postOptions)
  //   expect(postResponse.statusCode).toBe(302)
  //   expect(postResponse.headers.location).toBe('/productivity/score')
  // })
})
