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
  return htmlPage
    .querySelector('ul.govuk-error-summary__list')
    .querySelectorAll('li')
}

const getTargetError = (errors, targetText) => {
  return Object.values(errors).filter((error) => {
    return extractCleanText(error) === targetText
  })
}

const getBackLink = (htmlPage) => {
  return htmlPage.querySelector('.govuk-back-link')
}

const extractCleanText = (element) => {
  return element.textContent.trim()
}

module.exports = {
  createPage,
  getQuestionH1,
  getQuestionCheckboxes,
  getQuestionErrors,
  getTargetError,
  getBackLink,
  extractCleanText
}
