const Integration = require("../../index");
const Folder = require("../folder");

describe("Azure Blob Folder", () => {
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
    it("sets root folder correctly when id is 'root'", () => {
      let folder = new Folder("root", connection);
      expect(folder.id).toEqual("");
    });

    it("sets root folder correctly when id is '/'", () => {
      let folder = new Folder("/", connection);
      expect(folder.id).toEqual("");
    });

    it("parses through full paths to folder, and removes slashes", () => {
      let folder = new Folder("/a/full/path/to/folder/", connection);
      expect(folder.id).toEqual("a/full/path/to/folder");
    });

    it("parses through full paths to folder", () => {
      let folder = new Folder("a/full/path/to/folder", connection);
      expect(folder.id).toEqual("a/full/path/to/folder");
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
          kind: "prefix",
          name: "testDirectory"
        },
        {
          kind: "file",
          name: "testFile.txt"
        }
      ];

      const asyncIterable = function () {
        return {
          async *[Symbol.asyncIterator]() {
            yield* list;
          },
        };
      }

      folder.containerClient.listBlobsByHierarchy = asyncIterable;

      let result = await folder.list_files();

      expect(result.map((entity) => {
        return {
          type: entity.type,
          id: entity.id
        }
      })).toMatchSnapshot();
    });
  });

  describe("upload_file", () => {
    beforeEach(async () => {
      connection = await Integration({
        account: expectedAccount,
        accountKey: expectedAccountKey,
        containerURL: expectedContainerURL
      });
    });


    it("gives you a file", async () => {
      let folder = new Folder("root", connection);

      let local_file_path = "expected-local-file-path";

      let uploadFileFn = jest.fn();

      connection.containerClient.getBlockBlobClient = jest.fn().mockImplementation(() => {
        return {
          uploadFile: uploadFileFn
        }
      });

      let result = await folder.upload_file(local_file_path);

      expect(uploadFileFn).toHaveBeenCalledWith(local_file_path);
      expect(result.type).toEqual("file");
      expect(result.id).toEqual(`${local_file_path}`);
    });
  });

  describe("new_folder", () => {
    it("doesn't really do much, since this is Azure Blob and folders don't really exist", async () => {
      let folder = new Folder("root", connection);

      let sub_folder_name = "testFolder";

      let result = await folder.new_folder(sub_folder_name);

      expect(result.type).toEqual("folder");
      expect(result.id).toEqual(`${sub_folder_name}`);
    });
  });

  describe("delete", () => {
    it("deletes any files underneath the folder", async () => {
      let folder = new Folder("root", connection);

      let list = [{
        delete: jest.fn()
      }, {
        delete: jest.fn()
      }];

      folder.list_files = jest.fn().mockImplementation(() => {
        return list;
      });

      await folder.delete();

      expect(list[0].delete).toHaveBeenCalled();
      expect(list[1].delete).toHaveBeenCalled();
    });
  });

});