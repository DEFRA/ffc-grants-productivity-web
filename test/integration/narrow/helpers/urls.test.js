const urlPrefix = require("../../../../app/config/server").urlPrefix;
describe("getUrl()", () => {
  jest.mock("../../../../app/helpers/session");
  const { getYarValue } = require("../../../../app/helpers/session");

  const { getUrl } = require("../../../../app/helpers/urls");
  let urlObject = null;
  let secBtn = "Back to score";
  let dict = {};
  beforeEach(() => {
    getYarValue.mockImplementation((req, key) => {
      console.log('here: mock: ', dict[key]);
      return dict[key]
    });
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
  it("should return elseUrl if urlObject and dependent Yar values are not present", () => {
    urlObject = {
      dependentQuestionYarKey: "tenancy",
      dependentAnswerKeysArray: ["tenancy-A1"],
      urlOptions: {
        thenUrl: "thenUrl",
        elseUrl: "elseUrl",
      },
    };
     dict = {
      tenancy: "No",
    };
    const selectedURL = getUrl(urlObject, "mock-url", {}, "", "");
    expect(selectedURL).toEqual("elseUrl");
  });
  it("should return thenUrl if urlObject and dependent Yar values are present", () => {
    urlObject = {
      dependentQuestionYarKey: ['tenancy'],
      dependentAnswerKeysArray: ["tenancy-A1"],
      urlOptions: {
        thenUrl: "thenUrl",
        elseUrl: "elseUrl",
      },
    };
    dict = {
      tenancy: "Yes",
    };
    expect(getUrl(urlObject, "mock-url", {}, "", "")).toEqual("thenUrl");
  });

  it.only("should return the correct thenUrl if urlObject and co-responding Yar values are present", () => {
    urlObject = {
      dependentQuestionYarKey: ['tenancy', 'applicant', 'businessLocation'],
      dependentAnswerKeysArray: ["tenancy-A1", 'applicant-A2', 'business-location-A1'],
      urlOptions: {
        thenUrl: ["thenUrl", "thenUrl2", "thenUrl3"],
        elseUrl: "elseUrl",
      },
    };
    dict = {
      tenancy: "Yes",
      applicant: "Not The Answer We Are Looking For",
    };
    expect(getUrl(urlObject, "mock-url", {}, "", "")).toEqual("thenUrl");
    dict = {
      tenancy: "Not an answer we are looking for",
      applicant: "Contractor",
    };
    expect(getUrl(urlObject, "mock-url", {}, "", "")).toEqual("thenUrl2");
    dict = {
      businessLocation: "Yes",
    };
    expect(getUrl(urlObject, "mock-url", {}, "", "")).toEqual("thenUrl3");
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
});
