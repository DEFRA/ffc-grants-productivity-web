describe('polling.js', () => {
  const value = require('../../../app/config/cache')

  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  test.skip('check cache config if env is test', () => {
    const {
      SESSION_CACHE_TTL,
      REDIS_HOSTNAME,
      REDIS_PORT,
      REDIS_PASSWORD,
      REDIS_PARTITION,
      NODE_ENV
    } = process.env

    process.env.NODE_ENV = 'test'

    expect(value).toEqual({
      useRedis: process.env.NODE_ENV !== 'test',
      expiresIn: SESSION_CACHE_TTL,
      catboxOptions: {
        host: REDIS_HOSTNAME,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        partition: REDIS_PARTITION,
        tls: NODE_ENV === 'production' ? {} : undefined
      }
    })
  })

  test.skip('check cache config if env is production', () => {
    const {
      SESSION_CACHE_TTL,
      REDIS_HOSTNAME,
      REDIS_PORT,
      REDIS_PASSWORD,
      REDIS_PARTITION,
      NODE_ENV
    } = process.env

    process.env.NODE_ENV = 'production'

    expect(value).toEqual({
      useRedis: NODE_ENV !== 'test',
      expiresIn: SESSION_CACHE_TTL,
      catboxOptions: {
        host: REDIS_HOSTNAME,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        partition: REDIS_PARTITION,
        tls: NODE_ENV === 'production' ? {} : undefined
      }
    })
  })

  test('Invalid env var throws error', () => {
    process.env.NODE_ENV = true
    process.env.SESSION_CACHE_TTL = 'hello'
    process.env.REDIS_HOSTNAME = 908
    process.env.REDIS_PORT = 87
    process.env.REDIS_PASSWORD = 98
    process.env.REDIS_PARTITION = 876

    expect(() => require('../../../app/config/cache')).toThrow()
  })
})
