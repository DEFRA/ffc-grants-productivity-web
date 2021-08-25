
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
  const { yarKey, title, hint, answers, classes = 'govuk-fieldset__legend--l' } = question
  return {
    classes,
    idPrefix: yarKey,
    name: yarKey,
    fieldset: {
      legend: {
        text: title,
        isPageHeading: true,
        classes
      }
    },
    hint,
    items: setOptionsLabel(data, answers, conditionalHtml)
  }
}

const textField = (data, question) => {
  const { yarKey, prefix, suffix, label, hint, classes } = question
  return {
    id: yarKey,
    name: yarKey,
    classes,
    prefix,
    suffix,
    label,
    hint,
    value: data || ''
  }
}

const getAllInputs = (data, question, conditionalHtml) => {
  const { allFields } = question
  let dataObject
  if (!data) {
    allFields.forEach(field => {
      dataObject = {
        ...dataObject,
        [field.yarKey]: ''
      }
    })
    data = dataObject
  }
  return allFields.map((field) => {
    const { type } = field
    if (type === 'input') {
      return textField(data[field.yarKey], field)
    }
    return inputOptions(data[field.yarKey], field, conditionalHtml)
  })
}

const getOptions = (data, question, conditionalHtml) => {
  switch (question.type) {
    case 'input':
      return textField(data, question)
    case 'multi-input':
      return getAllInputs(data, question, conditionalHtml)
    default:
      return inputOptions(data, question, conditionalHtml)
  }
}

module.exports = {
  getOptions,
  setOptionsLabel
}
