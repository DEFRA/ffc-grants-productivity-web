const getHtml = (postcodeData, error) => {
  const postcode = postcodeData || ''

  return !error
    ? `<div>
        <label class="govuk-label" for="projectPostcode">
        In which postcode will the project take place?<br/><br/> Postcode
        </label>
        <input class="govuk-input govuk-!-width-one-third" id="projectPostcode" name="projectPostcode" value="${postcode}">
      </div>`
    : `<div class="govuk-form-group--error">
        <label class="govuk-label" for="projectPostcode">
        In which postcode will the project take place?<br/><br/> Postcode
        </label>
        <span id="post-code-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">
            Error:
          </span>
          ${error}
        </span>
        <input class="govuk-input govuk-!-width-one-third govuk-input--error" autocomplete="off" id="projectPostcode" name="projectPostcode" value="${postcode}">
      </div>`
}

module.exports = {
  getHtml
}
