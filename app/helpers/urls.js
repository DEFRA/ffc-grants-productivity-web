const urlPrefix = require('../config/server').urlPrefix
const { getYarValue } = require('../helpers/session')
const { ALL_QUESTIONS } = require('../config/question-bank')
const { getQuestionAnswer } = require('../helpers/utils')

const findDependentQuestion = (
  dependentQuestionYarKey,
  dependentAnswerKeysArray,
  dependentAnswer
) => {
  return ALL_QUESTIONS.find((thisQuestion) => {
    const hasMatchingAnswer = thisQuestion.answers?.some((answer) => {
      return (
        dependentAnswer &&
        dependentAnswerKeysArray.includes(answer.key) &&
        dependentAnswer.includes(answer.value)
      );
    });
    return thisQuestion.yarKey === dependentQuestionYarKey && hasMatchingAnswer;
  });
};
const getUrl = (urlObject, url, request, secBtn) => {
  const scorePath = `${urlPrefix}/score`
  const chekDetailsPath = `${urlPrefix}/check-details`
  const secBtnPath = secBtn === 'Back to score' ? scorePath : chekDetailsPath
  const isRobotics = getQuestionAnswer('project-subject', 'project-subject-A1')
  const isInEngland = getQuestionAnswer('tenancy', 'tenancy-A1')
  if (!urlObject || secBtn) {
    return secBtn ? secBtnPath : url
  }
  const { dependentQuestionYarKey, secondDependentQuestionYarKey, dependentAnswerKeysArray, seconddependentAnswerKeysArray, urlOptions } = urlObject // just make it work for now
  let { thenUrl, elseUrl, nonDependentUrl } = urlOptions;

  if (getYarValue(request, 'projectSubject') === isRobotics) {
    if (
      getYarValue(request, "tenancy") === isInEngland &&
      elseUrl === "project-responsibility"
    ) {
      elseUrl = "robotics/project-items";
    }
  }

  const dependentAnswer = getYarValue(request, dependentQuestionYarKey);
  console.log("dependentAnswer: ", dependentAnswer);

  const selectThenUrl = findDependentQuestion(
    dependentQuestionYarKey,
    dependentAnswerKeysArray,
    dependentAnswer
  );
  console.log("selectThenUrl: ", selectThenUrl);
  const selectedElseUrl = dependentAnswer ? elseUrl : nonDependentUrl;
  return selectThenUrl ? thenUrl : selectedElseUrl;
}

module.exports = {
  getUrl
}
