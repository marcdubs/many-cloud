const Integration = require("../../index");
const File = require("../file");
const Folder = require("../folder");

describe("Azure File Storage File", () => {
  const expectedAccount = "expected-account";
  const expectedAccountKey = "expected-account-key";
  const expectedURL = "https://not-microsoft.com/";
  const expectedShare = "myShare";
  const expectedShareURL = `${expectedURL}${expectedShare}`;

  let connection;

  beforeEach(async () => {
    connection = await Integration({
      account: expectedAccount,
      accountKey: expectedAccountKey,
      shareURL: expectedShareURL
    });
  });

  describe("when created", () => {
    it("parses through full paths to file", () => {
      let file = new File("/a/full/path/to/file.txt", connection);
      expect(file.fileClient.url).toEqual(expectedShareURL + "/a/full/path/to/file.txt");
    });

    it("can take a parent directory client to save time", () => {
      let parentFolder = new Folder("/a/full/path/to/folder", connection);
      let file = new File("/a/full/path/to/folder/file.txt", connection, parentFolder, "file.txt");
      expect(file.fileClient.url).toEqual(expectedShareURL + "/a/full/path/to/folder/file.txt");
    });
  });

});