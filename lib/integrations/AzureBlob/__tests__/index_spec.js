const integration = require("../");
const fs = require("fs");

describe("Azure Blob", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("with provided account and accountKey", () => {
    const expectedAccount = "expected-account";
    const expectedAccountKey = "expected-account-key";
    const expectedURL = "https://not-microsoft.com/";
    const expectedContainer = "myContainer";
    const expectedContainerURL = `${expectedURL}${expectedContainer}`;

    let connection;

    beforeEach(async () => {
      connection = await integration({
        account: expectedAccount,
        accountKey: expectedAccountKey,
        containerURL: expectedContainerURL
      });
    });

    it("sets url", () => {
      expect(connection.containerClient.url).toEqual(expectedContainerURL);
    });

    it("sets accountName", () => {
      expect(connection.containerClient.credential.accountName).toEqual(expectedAccount);
    });
  });

  describe("when not provided explicit settings", () => {
    const expectedAccount = "expected-account";
    const expectedAccountKey = "expected-account-key";
    const expectedURL = "https://not-microsoft.com/";
    const expectedContainer = "myContainer";
    const expectedContainerURL = `${expectedURL}${expectedContainer}`;

    let connection;

    beforeEach(async () => {
      connection = await integration({
        account: expectedAccount,
        accountKey: expectedAccountKey,
        containerURL: expectedContainerURL
      });
    });

    it("sets them to their default values", () => {
      expect(connection.settings.autoMkdirOnFileUpload).toEqual(true);
    });
  });

  describe("when provided with explicit settings", () => {
    const expectedAccount = "expected-account";
    const expectedAccountKey = "expected-account-key";
    const expectedURL = "https://not-microsoft.com/";
    const expectedContainer = "myContainer";
    const expectedContainerURL = `${expectedURL}${expectedContainer}`;

    let connection;

    beforeEach(async () => {
      connection = await integration({
        account: expectedAccount,
        accountKey: expectedAccountKey,
        containerURL: expectedContainerURL,
        settings: {
          autoMkdirOnFileUpload: false
        }
      });
    });

    it("sets them to their default values", () => {
      expect(connection.settings.autoMkdirOnFileUpload).toEqual(false);
    });
  });

  describe("with credentials stored in file", () => {
    const expectedAccount = "expected-account-from-file";
    const expectedURL = "https://not-microsoft.com/";
    const expectedContainer = "myContainerFromFile";
    const expectedContainerURL = `${expectedURL}${expectedContainer}`;

    let connection;

    beforeEach(async () => {
      jest.mock(
        "../../../../credentials/azure_blob.json",
        () => {
          return {
            account: "expected-account-from-file",
            accountKey: "expected-account-from-file-key",
            containerURL: "https://not-microsoft.com/myContainerFromFile"
          };
        },
        { virtual: true }
      );

      jest.spyOn(fs, "existsSync").mockImplementationOnce(() => { return true });

      connection = await integration({});
    });

    it("sets url", () => {
      expect(connection.containerClient.url).toEqual(expectedContainerURL);
    });

    it("sets accountName", () => {
      expect(connection.containerClient.credential.accountName).toEqual(expectedAccount);
    });
  });


  describe("without any parameters", () => {
    it("throws an error", async () => {
      jest.mock(
        "../../../../credentials/azure_blob.json",
        () => {
          return {};
        },
        { virtual: true }
      );

      await expect(integration({})).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});