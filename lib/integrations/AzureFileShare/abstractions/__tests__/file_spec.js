const Integration = require("../../index");
const File = require("../file");
const Folder = require("../folder");

const tmp = require("tmp");
const path = require("path");
const fs = require("fs");

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

  describe("download_to", () => {
    let tempDir;

    beforeEach(() => {
      tempDir = tmp.dirSync({
        unsafeCleanup: true,
      });
    });

    afterEach(() => {
      tempDir.removeCallback();
    });

    it("calls downloadToFile", async () => {
      let file = new File("/a/full/path/to/file.txt", connection);

      let uploadFn = jest.fn();

      file.fileClient.downloadToFile = uploadFn;

      await file.download_to(path.join(tempDir.name, 'file_that_does_not_exist.txt'));

      expect(uploadFn).toHaveBeenCalled();
    });

    it("deletes files if they exist", async () => {
      let file = new File("/a/full/path/to/file.txt", connection);

      let local_file_path = path.join(tempDir.name, 'file_that_exists.txt');

      fs.writeFileSync(local_file_path, 'Test Data');

      expect(fs.existsSync(local_file_path)).toBeTruthy();

      file.fileClient.downloadToFile = jest.fn();

      await file.download_to(local_file_path);

      expect(fs.existsSync(local_file_path)).toBeFalsy();
    });
  });

});