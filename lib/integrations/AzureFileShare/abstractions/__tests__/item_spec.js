const Integration = require("../../index");
const File = require("../file");
const Folder = require("../folder");

describe("Azure File Storage Item", () => {
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

  describe("get_parent", () => {
    it("gets folder for parent of file", async () => {
      let file = new File("/a/full/path/to/folder/file.txt", connection);
      let parent = await file.get_parent();
      expect(parent.directoryClient.url).toEqual("https://not-microsoft.com/myShare/a/full/path/to/folder");
    });
  });

  describe("get_name", () => {
    it("gets the name of a file", async () => {
      let file = new File("/a/full/path/to/folder/file.txt", connection);
      expect(await file.get_name()).toEqual("file.txt");
    });

    it("gets the name of a folder", async () => {
      let folder = new Folder("/a/full/path/to/folder", connection);
      expect(await folder.get_name()).toEqual("folder");
    });

    it("gets the name of root folder", async () => {
      let folder = new Folder("/", connection);
      expect(await folder.get_name()).toEqual("root");
    });
  });
});