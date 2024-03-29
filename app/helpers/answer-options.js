const { getYarValue } = require('../helpers/session')

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

function setSelectLabels (data, selectList) {
  return [
    { text: 'Select an option', value: '' },
    ...selectList.map((selectValue) => {
      return {
        value: selectValue,
        text: selectValue,
        selected: data === selectValue
      }
    })

  ]
}

const inputOptions = (data, question, conditionalHtml) => {
  const { yarKey, title, hint, answers, classes = 'govuk-fieldset__legend--l' } = question
  return {
    classes,
    id: yarKey,
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

const selectField = (data, question) => {
  const { yarKey, label, hint, answers, classes = 'govuk-fieldset__legend--l' } = question

  return {
    classes,
    id: yarKey,
    name: yarKey,
    label,
    hint,
    items: setSelectLabels(data, answers)
  }
}

const textField = (data, question, request = null) => {
  const { yarKey, prefix, suffix, label, classes, inputmode } = question
  const project = request ? getYarValue(request, 'projectSubject') : null
  if (yarKey === 'projectName') {
    question.hint.text = project === 'Slurry Acidification' ? 'For example, Browns Hill Farm slurry acidification' : 'For example, Browns Hill Farm robotic milking'
  }
  return {
    id: yarKey,
    name: yarKey,
    classes,
    prefix,
    suffix,
    label,
    hint: question.hint,
    value: data || '',
    inputmode
  }
}

const textAreaField = (data, question, request = null) => {
  const { yarKey, prefix, suffix, label, classes, maxlength } = question
  const project = request ? getYarValue(request, 'projectSubject') : null
  if (yarKey === 'projectName') {
    question.hint.text = project === 'Slurry Acidification' ? 'For example, Browns Hill Farm slurry acidification' : 'For example, Browns Hill Farm robotic milking'
  }
  return {
    id: yarKey,
    name: yarKey,
    classes,
    prefix,
    suffix,
    label,
    maxlength,
    hint: question.hint,
    value: data || ''
  }
}

const getAllInputs = (data, question, conditionalHtml, request) => {
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
    const { type, endFieldset } = field
    let fieldItems
    switch (type) {
      case 'sub-heading':
        fieldItems = { text: field.text }
        break
      case 'input':
        fieldItems = textField(data[field.yarKey], field, request)
        break
      case 'email':
        fieldItems = textField(data[field.yarKey], field, request)
        break
      case 'tel':
        fieldItems = textField(data[field.yarKey], field, request)
        break
      case 'text':
        fieldItems = textField(data[field.yarKey], field, request)
        break
      case 'textarea':
        fieldItems = textAreaField(data[field.yarKey], field, request)
        break
      case 'select':
        fieldItems = selectField(data[field.yarKey], field)
        break
      default:
        fieldItems = inputOptions(data[field.yarKey], field, conditionalHtml)
        break
    }

    return {
      type,
      endFieldset,
      ...fieldItems
    }
  })
}

const getOptions = (data, question, conditionalHtml, request) => {
  switch (question.type) {
    case 'input':
      return textField(data, question)
    case 'email':
      return textField(data, question)
    case 'tel':
      return textField(data, question)
    case 'multi-input':
      return getAllInputs(data, question, conditionalHtml, request)
    case 'select':
      return selectField(data, question)
    default:
      return inputOptions(data, question, conditionalHtml)
  }
}

module.exports = {
  getOptions,
  setOptionsLabel
}
