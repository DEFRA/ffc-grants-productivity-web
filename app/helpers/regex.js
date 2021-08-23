const DIGITS_MAX_7 = /^\d{0,7}$/
const NUMBER_REGEX = /^\d+$/
const SELECT_VARIABLE_TO_REPLACE = /{{_(.+?)_}}/ig
const DELETE_POSTCODE_CHARS_REGEX = /[)(.\s-]*/g
const POSTCODE_REGEX = /^[\s]*[a-z]{1,2}\d[a-z\d]?[\s]*\d[a-z]{2}[\s]*$/i

module.exports = {
  DIGITS_MAX_7,
  SELECT_VARIABLE_TO_REPLACE,
  DELETE_POSTCODE_CHARS_REGEX,
  POSTCODE_REGEX,
  NUMBER_REGEX
}
