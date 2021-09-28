const getHtml = (label, labelData, fieldValueData, error) => {
  const fieldValue = fieldValueData || ''

  if (label === 'roboticEquipment') {
    return !error
      ? `<div>
        <label class="govuk-label" for="${label}">
        ${labelData}
        </label>
        <textarea class="govuk-textarea" rows="5" id="${label}" name="${label}">${fieldValue}</textarea>
      </div>`
      : `<div class="govuk-form-group--error">
        <label class="govuk-label" for="${label}">
        ${labelData}
        </label>
        <span id="post-code-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">
            Error:
          </span>
          ${error}
        </span>
        <textarea class="govuk-textarea govuk-input--error" rows="5" autocomplete="off" id="${label}" name="${label}">${fieldValue}</textarea>
      </div>`
  }

  return !error
    ? `<div>
        <label class="govuk-label" for="${label}">
        ${labelData}
        </label>
        <input class="govuk-input govuk-!-width-one-third" id="${label}" name="${label}" value="${fieldValue}">
      </div>`
    : `<div class="govuk-form-group--error">
        <label class="govuk-label" for="${label}">
        ${labelData}
        </label>
        <span id="post-code-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">
            Error:
          </span>
          ${error}
        </span>
        <input class="govuk-input govuk-!-width-one-third govuk-input--error" autocomplete="off" id="${label}" name="${label}" value="${fieldValue}">
      </div>`
}

module.exports = {
  getHtml
}
