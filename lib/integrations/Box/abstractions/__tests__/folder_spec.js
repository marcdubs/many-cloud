const Folder = require("../folder");

describe("folder", () => {
  describe("constructor", () => {
    describe("when provided root as the folder ID", () => {
      const expected_id = 0,
        expected_connection = "test",
        expected_type = "folder";
      let actual;
      beforeEach(() => {
        actual = new Folder("root", expected_connection);
      });

      it("sets the connection object", () => {
        expect(actual.connection).toEqual(expected_connection);
      });

      it("sets the folder ID to 0", () => {
        expect(actual.id).toEqual(expected_id);
      });

      it("sets the type", () => {
        expect(actual.type).toEqual(expected_type);
      });
    });

    describe("when not provided root as the folder ID", () => {
      const expected_id = 1234,
        expected_connection = "test";
      let actual;
      beforeEach(() => {
        actual = new Folder(expected_id, expected_connection);
      });

      it("sets the connection object to what we passed in", () => {
        expect(actual.connection).toEqual(expected_connection);
      });

      it("sets the folder ID to what we passed in", () => {
        expect(actual.id).toEqual(expected_id);
      });
    });
  });

  describe("list_files", () => {
    describe("when operation is successfull", () => {
      const expected_entries = [
        {
          id: "1234",
          name: "Folder1",
          type: "folder"
        },
        {
          id: "4321",
          name: "File1",
          type: "file"
        }
      ];
      let folder, actual, connection;
      beforeEach(async done => {
        connection = {
          list_all_files: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              resolve({ entries: expected_entries });
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

  describe("upload_file", () => {
    describe("when operation is successfull", () => {
      let folder, connection, actual;
      const expected_id = "expected_id";
      beforeEach(async () => {
        connection = {
          upload_file: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              resolve({
                entries: [
                  {
                    id: expected_id
                  }
                ]
              });
            });
          })
        };
        folder = new Folder("1234", connection);
        actual = await folder.upload_file("path");
      });

      it("calls connection.upload_file", () => {
        expect(connection.upload_file).toHaveBeenCalled();
      });

      it("returns a file with the expected id", () => {
        expect(actual.id).toEqual(expected_id);
      });
    });

    describe("when operation is unsuccessfull", () => {
      let folder, connection;
      const expected_error = "OH MAN IT HAPPENED AGAIN!";
      beforeEach(() => {
        connection = {
          upload_file: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              reject(new Error(expected_error));
            });
          })
        };
        folder = new Folder("1234", connection);
      });

      it("rejects with the error", async () => {
        await expect(
          folder.upload_file("path")
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });
});
