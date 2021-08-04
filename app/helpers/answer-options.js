function isChecked (data, option) {
  return !!data && data.includes(option)
}

function setOptionsLabel (data, answers) {
  return answers.map((answer) => {
    const { value, hint, text, conditional } = answer

    if (value === 'divider') {
      return { divider: 'or' }
    }

    if (typeof (value) === 'string') {
      return {
        value,
        text: value,
        conditional,
        hint,
        checked: isChecked(data, value),
        selected: data === value
      }
    }

    return {
      value,
      text,
      conditional,
      hint,
      checked: isChecked(data, value),
      selected: data === value
    }
  })
}

const inputOptions = (data, question) => {
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
    hint,
    items: setOptionsLabel(data, answers)
  }
}

const textField = (data, question) => {
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

const getOptions = (data, question) => {
  switch (question.type) {
    case 'input':
      return textField(data, question)
    default:
      return inputOptions(data, question)
  }
}

module.exports = {
  getOptions
}
