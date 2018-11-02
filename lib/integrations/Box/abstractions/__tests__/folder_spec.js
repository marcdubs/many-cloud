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

  describe("retrieve_info", () => {
    describe("when the folder is not trashed and has a parent", () => {
      const expected_info = {
        name: "The Stuff",
        size: 9001,
        parent: {
          id: 4444,
          name: "Parent Name"
        },
        trashed_at: null
      };
      let folder, connection;
      beforeEach(async done => {
        connection = {
          get_folder_info: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              resolve(expected_info);
            });
          })
        };
        folder = new Folder("1234", connection);
        await folder.retrieve_info();
        done();
      });

      it("adds expected name to the folder object", () => {
        expect(folder.name).toEqual(expected_info.name);
      });

      it("adds expected size to the folder object", () => {
        expect(folder.size).toEqual(expected_info.size);
      });

      it("sets trashed to false", () => {
        expect(folder.trashed).toEqual(false);
      });

      it("sets parent id", () => {
        expect(folder.parent.id).toEqual(expected_info.parent.id);
      });

      it("sets parent name", () => {
        expect(folder.parent.name).toEqual(expected_info.parent.name);
      });
    });

    describe("when the folder is trashed and does not have a parent", () => {
      const expected_info = {
        name: "The Stuff",
        size: 9001,
        parent: null,
        trashed_at: "not_null"
      };
      let folder, connection;
      beforeEach(async done => {
        connection = {
          get_folder_info: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              resolve(expected_info);
            });
          })
        };
        folder = new Folder("1234", connection);
        await folder.retrieve_info();
        done();
      });

      it("adds expected name to the folder object", () => {
        expect(folder.name).toEqual(expected_info.name);
      });

      it("adds expected size to the folder object", () => {
        expect(folder.size).toEqual(expected_info.size);
      });

      it("sets trashed to true", () => {
        expect(folder.trashed).toEqual(true);
      });

      it("sets parent to null", () => {
        expect(folder.parent).toEqual(null);
      });
    });

    describe("when the operation is unsuccessfull", () => {
      const expected_error = "Bing it";
      let folder, connection;
      beforeEach(() => {
        connection = {
          get_folder_info: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              reject(new Error(expected_error));
            });
          })
        };
        folder = new Folder("1234", connection);
      });

      it("adds expected name to the folder object", async () => {
        await expect(
          folder.retrieve_info()
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe("get_name", () => {
    describe("when the name has already been retrieved", () => {
      const expected_name = "The Stuff";
      let folder, actual;
      beforeEach(async done => {
        folder = new Folder("1234", null);
        folder.name = expected_name;
        actual = await folder.get_name();
        done();
      });

      it("returns the name", () => {
        expect(actual).toEqual(expected_name);
      });
    });

    describe("when the name has not already been retrieved", () => {
      describe("when the operation is successfull", () => {
        const expected_name = "The Stuff";
        let folder, actual, retrieve_info;
        beforeEach(async done => {
          retrieve_info = jest.fn().mockImplementation(() => {
            folder.name = expected_name;
          });

          folder = new Folder("1234", null);
          folder.retrieve_info = retrieve_info;
          actual = await folder.get_name();
          done();
        });

        it("calls the retrieve_info function", () => {
          expect(retrieve_info).toHaveBeenCalled();
        });

        it("returns the name", () => {
          expect(actual).toEqual(expected_name);
        });
      });

      describe("when the operation is unsuccessfull", () => {
        const expected_error = "Ask it";
        let folder, retrieve_info;
        beforeEach(() => {
          retrieve_info = jest.fn().mockImplementation(() => {
            throw new Error(expected_error);
          });

          folder = new Folder("1234", null);
          folder.retrieve_info = retrieve_info;
        });

        it("rejects with the error", async () => {
          await expect(
            folder.get_name()
          ).rejects.toThrowErrorMatchingSnapshot();
        });
      });
    });
  });

  describe("get_parent", () => {
    describe("when the parent has already been retrieved", () => {
      const expected_parent = "The Parent";
      let folder, actual;
      beforeEach(async done => {
        folder = new Folder("1234", null);
        folder.parent = expected_parent;
        actual = await folder.get_parent();
        done();
      });

      it("returns the parent", () => {
        expect(actual).toEqual(expected_parent);
      });
    });

    describe("when the parent has not already been retrieved", () => {
      describe("when the operation is successfull", () => {
        const expected_parent = "The Parent";
        let folder, actual, retrieve_info;
        beforeEach(async done => {
          retrieve_info = jest.fn().mockImplementation(() => {
            folder.parent = expected_parent;
          });

          folder = new Folder("1234", null);
          folder.retrieve_info = retrieve_info;
          actual = await folder.get_parent();
          done();
        });

        it("calls the retrieve_info function", () => {
          expect(retrieve_info).toHaveBeenCalled();
        });

        it("returns the parent", () => {
          expect(actual).toEqual(expected_parent);
        });
      });

      describe("when the operation is unsuccessfull", () => {
        const expected_error = "Aol it";
        let folder, retrieve_info;
        beforeEach(() => {
          retrieve_info = jest.fn().mockImplementation(() => {
            throw new Error(expected_error);
          });

          folder = new Folder("1234", null);
          folder.retrieve_info = retrieve_info;
        });

        it("rejects with the error", async () => {
          await expect(
            folder.get_parent()
          ).rejects.toThrowErrorMatchingSnapshot();
        });
      });
    });
  });
});
