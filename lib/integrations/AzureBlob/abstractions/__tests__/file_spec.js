const Integration = require("../../index");
const File = require("../file");
const Folder = require("../folder");

const tmp = require("tmp");
const path = require("path");
const fs = require("fs");

describe("Azure Blob File", () => {
  const expectedAccount = "expected-account";
  const expectedAccountKey = "expected-account-key";
  const expectedURL = "https://not-microsoft.com/";
  const expectedContainer = "myContainer";
  const expectedContainerURL = `${expectedURL}${expectedContainer}`;

  let connection;

  beforeEach(async () => {
    connection = await Integration({
      account: expectedAccount,
      accountKey: expectedAccountKey,
      containerURL: expectedContainerURL
    });
  });

  describe("when created", () => {
    it("creates a blockBlobClient with accurate URL", () => {
      let file = new File("/a/full/path/to/file.txt", connection);
      expect(file.blockBlobClient.url).toEqual(expectedContainerURL + "/a/full/path/to/file.txt");
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

      file.blockBlobClient.downloadToFile = uploadFn;

      await file.download_to(path.join(tempDir.name, 'file_that_does_not_exist.txt'));

      expect(uploadFn).toHaveBeenCalled();
    });

    it("deletes files if they exist", async () => {
      let file = new File("/a/full/path/to/file.txt", connection);

      let local_file_path = path.join(tempDir.name, 'file_that_exists.txt');

      fs.writeFileSync(local_file_path, 'Test Data');

      expect(fs.existsSync(local_file_path)).toBeTruthy();

      file.blockBlobClient.downloadToFile = jest.fn();

      await file.download_to(local_file_path);

      expect(fs.existsSync(local_file_path)).toBeFalsy();
    });
  });

  describe("get_checksum", () => {
    it("gets the correct MD5 checksum for a file", async () => {
      let file = new File("/a/full/path/to/file.txt", connection);

      file.download_to = jest.fn().mockImplementation((localFilePath) => {
        fs.writeFileSync(localFilePath, "testfilecontenthi");
      });

      let result = await file.get_checksum();

      expect(file.download_to).toHaveBeenCalled();
      expect(result).toMatchSnapshot();
    });
  });

  describe("delete", () => {
    it("called delete on the blockBlobClient", async () => {
      let file = new File("/a/full/path/to/file.txt", connection);
      file.blockBlobClient.delete = jest.fn();
      await file.delete();
      expect(file.blockBlobClient.delete).toHaveBeenCalled();
    });
  });
});