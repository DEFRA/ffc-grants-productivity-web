
function isChecked (data, option) {
  return !!data && data.includes(option)
}

function setOptionsLabel (data, answers, conditionalHtml) {
  return answers.map((answer) => {
    const { value, hint, text, conditional } = answer

    if (value === 'divider') {
      return { divider: 'or' }
    }

    if (typeof (value) === 'string') {
      return {
        value,
        text: value,
        ...conditional ? { conditional: { html: conditionalHtml } } : {},
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

const inputOptions = (data, question, conditionalHtml) => {
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
    items: setOptionsLabel(data, answers, conditionalHtml)
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

const getOptions = (data, question, conditionalHtml) => {
  if (question.type === 'input') {
    return textField(data, question)
  }
  return inputOptions(data, question, conditionalHtml)
}

module.exports = {
  getOptions
}
