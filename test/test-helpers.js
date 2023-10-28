const createPage = (textContent) => {
  return new JSDOM(textContent).window.document
}
const getQuestionH1 = (htmlPage) => {
  return htmlPage.querySelector('h1.govuk-fieldset__heading')
}
const getQuestionCheckboxes = (htmlPage) => {
  return htmlPage.querySelectorAll('input.govuk-checkboxes__input')
}
const getQuestionRadios = (htmlPage) => {
  return htmlPage.querySelectorAll('input.govuk-radios__input')
}
const getQuestionLabels = (htmlPage) => {
  return htmlPage.querySelectorAll('label.govuk-label')
}
const getQuestionErrors = (htmlPage) => {
  return htmlPage
    .querySelector('ul.govuk-error-summary__list')
    .querySelectorAll('li')
}
const getTargetByText = (elements, targetText) => {
  return Object.values(elements).filter((error) => {
    return extractCleanText(error) === targetText
  })
}
const getBackLink = (htmlPage) => {
  return htmlPage.querySelector('.govuk-back-link')
}
const extractCleanText = (element) => {
  return element.textContent.trim()
}
const findParagraphs = (htmlPage) => {
  return htmlPage.querySelectorAll('p')
}
const findButton = (htmlPage, value) => {
  return htmlPage.querySelector(`input[value="${value}"]`)
}

module.exports = {
  createPage,
  getQuestionH1,
  getQuestionCheckboxes,
  getQuestionRadios,
  getQuestionLabels,
  getQuestionErrors,
  getTargetByText,
  getBackLink,
  extractCleanText,
  findParagraphs,
  findButton
}
