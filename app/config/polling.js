const Joi = require('joi')

require('dotenv').config()

// Define config schema
const schema = Joi.object({
  interval: Joi.number().default(60),
  retries: Joi.number().default(10),
  host: Joi.string().default('http://host.docker.internal:3011')

})

// Build config
const config = {
  interval: process.env.POLLING_INTERVAL,
  retries: process.env.POLLING_RETRIES,
  host: process.env.BACKEND_POLLING_HOST
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The polling config is invalid. ${result.error.message}`)
}

module.exports = result.value
