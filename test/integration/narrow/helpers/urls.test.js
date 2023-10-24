const urlPrefix = require("../../../../app/config/server").urlPrefix;
describe("getUrl()", () => {
  jest.mock("../../../../app/helpers/session");
  const { getYarValue } = require("../../../../app/helpers/session");

  const { getUrl } = require("../../../../app/helpers/urls");
  let urlObject = null;
  let secBtn = "Back to score";
  let dict = {};
  beforeEach(() => {
    getYarValue.mockImplementation((req, key) => dict[key]);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should return url if urlObject is empty", () => {
    expect(getUrl(urlObject, "mock-url", {}, secBtn, "")).toEqual(
      `${urlPrefix}/score`
    );
    secBtn = "";
    expect(getUrl(urlObject, "mock-url", {}, secBtn, "")).toEqual("mock-url");
  });

  it.skip("should return nonDependentUrl if urlObject is present, but yar values are empty", () => {
    urlObject = {
      dependentQuestionYarKey: "dependentQuestionYarKey",
      dependentAnswerKeysArray: ["dependentAnswerKeysArray"],
      urlOptions: {
        thenUrl: "thenUrl",
        elseUrl: "elseUrl",
        nonDependentUrl: "nonDependentUrl",
      },
    };
    const selectedURL = getUrl(urlObject, "mock-url", {}, secBtn, "");
    console.log("here: ", selectedURL);
    expect(selectedURL).toEqual("nonDependentUrl");
  });
  it("should return elseUrl if urlObject and dependent Yar values are present", () => {
    urlObject = {
      dependentQuestionYarKey: "dependentQuestionYarKey",
      dependentAnswerKeysArray: "dependentAnswerKeysArray",
      urlOptions: {
        thenUrl: "thenUrl",
        elseUrl: "elseUrl",
        nonDependentUrl: "nonDependentUrl",
      },
    };
    dict = {
      dependentQuestionYarKey: "dependentAnswerKeysArray",
    };
    expect(getUrl(urlObject, "mock-url", {}, secBtn, "")).toEqual("elseUrl");
  });
  it('should return secBtnPath if secBtn is "Back to score"', () => {
    urlObject = null;
    dict = {
      dependentQuestionYarKey: "dependentAnswerKeysArray",
    };
    expect(getUrl(urlObject, "mock-url", {}, "Back to score", "")).toEqual(
      `${urlPrefix}/score`
    );
  });

  it('should default to /check-details if secBtn is not "Back to score" and current url is not a building or planning page', () => {
    urlObject = null;
    dict = {
      dependentQuestionYarKey: "dependentAnswerKeysArray",
    };
    expect(
      getUrl(
        urlObject,
        "mock-url",
        {},
        "i-wish-i-was-writing-python",
        "or-even-java"
      )
    ).toEqual(`${urlPrefix}/check-details`);
  });
  it.skip("should redirect to /project-responsibility if user selected Robotics and is in England", () => {
    urlObject = null;
    dict = {
      projectSubject: "Robotics and automatic technology",
      tenancy: "Yes",
    };
    expect(getUrl(urlObject, "mock-url", {}, "", "")).toEqual(
      "project-responsibility"
    );
  });
});
