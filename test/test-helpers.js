const createPage = (textContent) => {
  return new JSDOM(textContent).window.document
}

const getQuestionH1 = (htmlPage) => {
  return htmlPage.querySelector('h1.govuk-fieldset__heading')
}

const getQuestionCheckboxes = (htmlPage) => {
  return htmlPage.querySelectorAll('input.govuk-checkboxes__input')
}

const getQuestionErrors = (htmlPage) => {
  return htmlPage.querySelectorAll('ul.govuk-error-summary__list')
}

const getBackLink = (htmlPage) => {
  return htmlPage.querySelector('.govuk-back-link')
}

const getQuestionRadios = (htmlPage) => {
  return htmlPage.querySelectorAll('input.govuk-radios__input')
}

module.exports = {
  createPage,
  getQuestionH1,
  getQuestionCheckboxes,
  getQuestionErrors,
  getBackLink,
  getQuestionRadios
}
