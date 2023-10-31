const createPage = (textContent) => {
  return new JSDOM(textContent).window.document
}
const getPageHeading = (htmlPage) => {
  return htmlPage.querySelector('h1.govuk-fieldset__heading')
}
const getPageCheckboxes = (htmlPage) => {
  return htmlPage.querySelectorAll('input.govuk-checkboxes__input')
}
const getPageRadios = (htmlPage) => {
  return htmlPage.querySelectorAll('input.govuk-radios__input')
}
const getPageLabels = (htmlPage) => {
  return htmlPage.querySelectorAll('label.govuk-label')
}
const getPageErrors = (htmlPage) => {
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
  getPageHeading,
  getPageCheckboxes,
  getPageRadios,
  getPageLabels,
  getPageErrors,
  getTargetByText,
  getBackLink,
  extractCleanText,
  findParagraphs,
  findButton
}
