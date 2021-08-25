const getHtml = (label, fieldValueData, error) => {
  const fieldValue = fieldValueData || ''
  const labelData = label === 'sbi' ? 'SBI number' : 'In which postcode will the project take place?<br/><br/> Postcode'

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
