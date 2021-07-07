const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  useRedis: Joi.bool().default(false),
  expiresIn: Joi.number().default(3600 * 1000) // 1 hour
})

const config = {
  useRedis: process.env.NODE_ENV !== 'test',
  expiresIn: process.env.SESSION_CACHE_TTL
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The cache config is invalid. ${result.error.message}`)
}

module.exports = result.value
