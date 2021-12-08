const integration = require("../");
const fs = require("fs");

describe("Azure File Share", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("with provided account and accountKey", () => {
    const expectedAccount = "expected-account";
    const expectedAccountKey = "expected-account-key";
    const expectedURL = "https://not-microsoft.com/";
    const expectedShare = "myShare";
    const expectedShareURL = `${expectedURL}${expectedShare}`;

    let connection;

    beforeEach(async () => {
      connection = await integration({
        account: expectedAccount,
        accountKey: expectedAccountKey,
        shareURL: expectedShareURL
      });
    });

    it("sets url", () => {
      expect(connection.shareClient.url).toEqual(expectedShareURL);
    });

    it("sets accountName", () => {
      expect(connection.shareClient.credential.accountName).toEqual(expectedAccount);
    });
  });

  describe("with credentials stored in file", () => {
    const expectedAccount = "expected-account-from-file";
    const expectedURL = "https://not-microsoft.com/";
    const expectedShare = "myShareFromFile";
    const expectedShareURL = `${expectedURL}${expectedShare}`;

    let connection;

    beforeEach(async () => {
      jest.mock(
        "../../../../credentials/azure_file_share.json",
        () => {
          return {
            account: "expected-account-from-file",
            accountKey: "expected-account-from-file-key",
            shareURL: "https://not-microsoft.com/myShareFromFile"
          };
        },
        { virtual: true }
      );

      jest.spyOn(fs, "existsSync").mockImplementationOnce(() => { return true });

      connection = await integration({});
    });

    it("sets url", () => {
      expect(connection.shareClient.url).toEqual(expectedShareURL);
    });

    it("sets accountName", () => {
      expect(connection.shareClient.credential.accountName).toEqual(expectedAccount);
    });
  });

  describe("without any parameters", () => {
    it("throws an error", async () => {
      await expect(integration({})).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});