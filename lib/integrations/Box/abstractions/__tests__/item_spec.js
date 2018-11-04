const Item = require("../item");

describe("item", () => {
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
        folder = new Item();
        folder.id = "1234";
        folder.type = "folder";
        folder.connection = connection;
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

    describe("when the item is a file", () => {
      const expected_info = {
        name: "The Stuff",
        size: 9001,
        parent: {
          id: 4444,
          name: "Parent Name"
        },
        trashed_at: null
      };
      let file, connection;
      beforeEach(async done => {
        connection = {
          get_file_info: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              resolve(expected_info);
            });
          })
        };
        file = new Item();
        file.id = "1234";
        file.connection = connection;
        file.type = "file";

        await file.retrieve_info();
        done();
      });

      it("adds expected name to the file object", () => {
        expect(file.name).toEqual(expected_info.name);
      });

      it("adds expected size to the file object", () => {
        expect(file.size).toEqual(expected_info.size);
      });

      it("sets trashed to false", () => {
        expect(file.trashed).toEqual(false);
      });

      it("sets parent id", () => {
        expect(file.parent.id).toEqual(expected_info.parent.id);
      });

      it("sets parent name", () => {
        expect(file.parent.name).toEqual(expected_info.parent.name);
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
        folder = new Item();
        folder.id = "1234";
        folder.type = "folder";
        folder.connection = connection;
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
        folder = new Item();
        folder.id = "1234";
        folder.type = "folder";
        folder.connection = connection;
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
        folder = new Item();
        folder.id = "1234";
        folder.type = "folder";
        folder.connection = null;
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

          folder = new Item();
          folder.id = "1234";
          folder.type = "folder";
          folder.connection = null;
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

          folder = new Item();
          folder.id = "1234";
          folder.type = "folder";
          folder.connection = null;
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
        folder = new Item();
        folder.id = "1234";
        folder.type = "folder";
        folder.connection = null;
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

          folder = new Item();
          folder.id = "1234";
          folder.type = "folder";
          folder.connection = null;
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

          folder = new Item();
          folder.id = "1234";
          folder.type = "folder";
          folder.connection = null;
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
