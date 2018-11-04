const Folder = require("../folder");

describe("folder", () => {
  describe("constructor", () => {
    const expected_id = "1234",
      expected_type = "folder",
      expected_connection = "dummy_connection";
    let actual;
    beforeEach(() => {
      actual = new Folder(expected_id, expected_connection);
    });

    it("sets the connection", () => {
      expect(actual.connection).toEqual(expected_connection);
    });

    it("sets the type", () => {
      expect(actual.type).toEqual(expected_type);
    });

    it("sets the id", () => {
      expect(actual.id).toEqual(expected_id);
    });
  });

  describe("list_files", () => {
    describe("when operation is successfull", () => {
      const expected_files = [
        {
          id: "1234",
          name: "Folder1",
          mimeType: "application/vnd.google-apps.folder"
        },
        {
          id: "4321",
          name: "File1",
          mimeType: "file"
        }
      ];
      let folder, actual, connection;
      beforeEach(async done => {
        connection = {
          list_all_files: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              resolve({ files: expected_files });
            });
          })
        };
        folder = new Folder("1234", connection);
        actual = await folder.list_files();
        done();
      });

      it("calls the list_all_files function", () => {
        expect(connection.list_all_files).toHaveBeenCalled();
      });

      it("returns an array of correct folders and files", () => {
        expect(actual).toMatchSnapshot();
      });
    });

    describe("when operation is unsuccessfull", () => {
      const expected_error = "Google it";
      let folder, connection;
      beforeEach(() => {
        connection = {
          list_all_files: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              reject(new Error(expected_error));
            });
          })
        };
        folder = new Folder("1234", connection);
      });

      it("rejects with the error", async () => {
        await expect(
          folder.list_files()
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });
});
