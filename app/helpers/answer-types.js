// const getHtml = require('../helpers/helper-functions')

function isChecked (data, option) {
  return !!data && data.includes(option)
}

function setAnswerOptions (data, answers) {
  return answers.map((answer) => {
    const { value, hint, text, isConditional } = answer

    const conditional = answer.conditional = {
      html: `<div>
    <label class="govuk-label" for="projectPostcode">
      What is the site postcode?<br/><br/> Postcode
    </label>
    <input class="govuk-input govuk-!-width-one-third" id="projectPostcode" name="projectPostcode" value="${value}">
  </div>`
    }

    if (value === 'divider') {
      return { divider: 'or' }
    }

    if (typeof (value) === 'string') {
      if (isConditional === true) {
        return {
          value,
          text: value,
          conditional: conditional,
          checked: isChecked(data, value),
          selected: data === value
        }
      } else {
        return {
          value,
          text: value,
          hint,
          checked: isChecked(data, value),
          selected: data === value
        }
      }
    }

    return {
      value,
      text,
      hint,
      checked: isChecked(data, value),
      selected: data === value
    }
  })
}

const radioButtons = (data, question) => {
  const { classes, yarKey, title, answers } = question
  return {
    classes,
    idPrefix: yarKey,
    name: yarKey,
    fieldset: {
      legend: {
        text: title,
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    items: setAnswerOptions(data, answers)
  }
}

const checkBoxes = (data, question) => {
  const { classes, yarKey, title, hint, answers } = question
  return {
    classes,
    idPrefix: yarKey,
    name: yarKey,
    fieldset: {
      legend: {
        text: title,
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    hint: {
      text: hint
    },
    items: setAnswerOptions(data, answers)
  }
}

const inputText = (data, question) => {
  const { yarKey, prefix, suffix, label, hint } = question
  return {
    id: yarKey,
    name: yarKey,
    classes: 'govuk-input--width-10',
    prefix,
    suffix,
    label,
    hint,
    value: data || ''
  }
}

module.exports = {
  radioButtons,
  checkBoxes,
  inputText
}
