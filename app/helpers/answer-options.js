
function isChecked (data, option) {
  return !!data && data.includes(option)
}

function setOptionsLabel (data, answers, conditionalHtml) {
  return answers.map((answer) => {
    const { value, hint, text, conditional } = answer

    if (value === 'divider') {
      return { divider: 'or' }
    }

    if (!answer.text) {
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

const textFieldList = (data, answers) => {
  const content = answers.map(
    ({ key, prefix, suffix, label, hint, classes }) => ({
      id: key,
      name: key,
      classes,
      prefix,
      suffix,
      label,
      hint,
      value: (!!data && data.key) || ''
    })
  )

  return { content }
}

const getModelItems = (data, question, conditionalHtml) => {
  if (question.type === 'input') {
    return textField(data, question)
  }

  if (question.type === 'inputList') {
    return textFieldList(data, question.answers)
  }
  return inputOptions(data, question, conditionalHtml)
}

module.exports = {
  getModelItems,
  setOptionsLabel
}
