const Integration = require("../../index");
const Folder = require("../folder");

describe("Azure File Storage Folder", () => {
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
    it("sets root folder correctly when id is 'root'", () => {
      let folder = new Folder("root", connection);
      expect(folder.directoryClient.url).toEqual(expectedShareURL + "/");
    });

    it("sets root folder correctly when id is '/'", () => {
      let folder = new Folder("/", connection);
      expect(folder.directoryClient.url).toEqual(expectedShareURL + "/");
    });

    it("parses through full paths to folder", () => {
      let folder = new Folder("/a/full/path/to/folder", connection);
      expect(folder.directoryClient.url).toEqual(expectedShareURL + "/a/full/path/to/folder");
    });

    it("can take a parent directory client to save time", () => {
      let parentFolder = new Folder("/a/full/path/to/folder", connection);
      let folder = new Folder("/a/full/path/to/folder/sub", connection, parentFolder, "sub");
      expect(folder.directoryClient.url).toEqual(expectedShareURL + "/a/full/path/to/folder/sub");
    });
  });

  describe("list_files", () => {
    let folder;

    beforeEach(() => {
      folder = new Folder("root", connection);
    });

    it("gives you a list of files and folders", async () => {
      let list = [
        {
          kind: "directory",
          value: { name: "testDirectory" }
        },
        {
          kind: "file",
          value: { name: "testFile.txt" }
        }
      ];

      const asyncIterable = function () {
        return {
          async *[Symbol.asyncIterator]() {
            yield* list;
          },
        };
      }

      folder.directoryClient.listFilesAndDirectories = asyncIterable;

      let result = await folder.list_files();

      expect(result.map((entity) => {
        return {
          type: entity.type,
          url: (entity.fileClient || entity.directoryClient).url,
          id: entity.id
        }
      })).toMatchSnapshot();
    });
  });

  describe("upload_file", () => {
    it("gives you a file", async () => {
      let folder = new Folder("root", connection);

      let local_file_path = "expected-local-file-path";

      let uploadFileFn = jest.fn();

      folder.directoryClient.getFileClient = jest.fn().mockImplementation(() => {
        return {
          uploadFile: uploadFileFn
        }
      });

      let result = await folder.upload_file(local_file_path);

      expect(uploadFileFn).toHaveBeenCalledWith(local_file_path);
      expect(result.type).toEqual("file");
      expect(result.id).toEqual(`/${local_file_path}`);
    });
  });

  describe("new_folder", () => {
    it("creates a new folder", async () => {
      let folder = new Folder("root", connection);

      let sub_folder_name = "testFolder";

      let createFolderFn = jest.fn();

      folder.directoryClient.getDirectoryClient = jest.fn().mockImplementation(() => {
        return {
          create: createFolderFn
        }
      });

      let result = await folder.new_folder(sub_folder_name);

      expect(createFolderFn).toHaveBeenCalled();
      expect(result.type).toEqual("folder");
      expect(result.id).toEqual(`/${sub_folder_name}`);
    });
  });
});