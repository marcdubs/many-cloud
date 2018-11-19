const Item = require("../item");

describe("item", () => {
  describe("retrieve_info", () => {
    describe("when everything happens successfully", () => {
      describe("when this is a folder", () => {
        describe("when this is the root folder", () => {
          let folder, actual;
          beforeEach(async done => {
            folder = new Item();
            folder.name = "Root";
            folder.id = "";
            folder.connection = null;
            folder.type = "folder";
            actual = await folder.retrieve_info();
            done();
          });

          it("sets the parent to null", () => {
            expect(folder.parent).toBeNull();
          });

          it("sets trashed to false", () => {
            expect(folder.trashed).toBe(false);
          });

          it("resolves with undefined", () => {
            expect(actual).toBeUndefined();
          });
        });

        describe("when this folder is inside the root folder", () => {
          let folder, actual;
          beforeEach(async done => {
            folder = new Item();
            folder.name = "something_else";
            folder.id = "something_else";
            folder.connection = null;
            folder.type = "folder";
            actual = await folder.retrieve_info();
            done();
          });

          it("sets the parent to the Root folder", () => {
            expect(folder.parent).toMatchSnapshot();
          });

          it("sets trashed to false", () => {
            expect(folder.trashed).toBe(false);
          });

          it("resolves with undefined", () => {
            expect(actual).toBeUndefined();
          });
        });

        describe("when this is a second-level folder", () => {
          let folder, actual;
          beforeEach(async done => {
            folder = new Item();
            folder.name = "child_folder";
            folder.id = "parent_folder/child_folder";
            folder.connection = null;
            folder.type = "folder";
            actual = await folder.retrieve_info();
            done();
          });

          it("sets the parent to the expected parent folder", () => {
            expect(folder.parent).toMatchSnapshot();
          });

          it("sets trashed to false", () => {
            expect(folder.trashed).toBe(false);
          });

          it("resolves with undefined", () => {
            expect(actual).toBeUndefined();
          });
        });
      });

      describe("when this is a file", () => {
        describe("when the file is found", () => {
          const expected_checksum = "123454321";
          let file, actual, connection;
          beforeEach(async done => {
            connection = {
              get_file_info: jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                  resolve({
                    ETag: expected_checksum
                  });
                });
              })
            };

            file = new Item();
            file.name = "a_file.txt";
            file.id = "parent_folder/a_file.txt";
            file.connection = connection;
            file.type = "file";
            actual = await file.retrieve_info();
            done();
          });

          it("calls get_file_info", () => {
            expect(connection.get_file_info).toHaveBeenCalledTimes(1);
          });

          it("sets the parent to the expected parent folder", () => {
            expect(file.parent).toMatchSnapshot();
          });

          it("sets the checksum to the expected checksum", () => {
            expect(file.checksum).toEqual(expected_checksum);
          });

          it("sets trashed to false", () => {
            expect(file.trashed).toBe(false);
          });

          it("resolves with undefined", () => {
            expect(actual).toBeUndefined();
          });
        });

        describe("when the file is not found", () => {
          let file, actual, connection;
          beforeEach(async done => {
            connection = {
              get_file_info: jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                  reject({ code: "NotFound" });
                });
              })
            };

            file = new Item();
            file.name = "a_file.txt";
            file.id = "parent_folder/a_file.txt";
            file.connection = connection;
            file.type = "file";
            actual = await file.retrieve_info();
            done();
          });

          it("calls get_file_info", () => {
            expect(connection.get_file_info).toHaveBeenCalledTimes(1);
          });

          it("sets the parent to the expected parent folder", () => {
            expect(file.parent).toMatchSnapshot();
          });

          it("sets trashed to true", () => {
            expect(file.trashed).toBe(true);
          });

          it("resolves with undefined", () => {
            expect(actual).toBeUndefined();
          });
        });

        describe("when get_file_info rejects with something other than NotFound", () => {
          let file, connection;
          beforeEach(() => {
            connection = {
              get_file_info: jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                  reject({ code: "OhNo!" });
                });
              })
            };

            file = new Item();
            file.name = "a_file.txt";
            file.id = "parent_folder/a_file.txt";
            file.connection = connection;
            file.type = "file";
          });

          it("rejects with the error", async () => {
            await expect(file.retrieve_info()).rejects.toMatchSnapshot();
          });
        });
      });
    });
  });

  describe("get_name", () => {
    const expected_name = "The Stuff";
    let folder, actual;
    beforeEach(async done => {
      folder = new Item();
      folder.name = expected_name;
      folder.id = "1234";
      folder.connection = null;
      folder.type = "folder";
      actual = await folder.get_name();
      done();
    });

    it("returns the name", () => {
      expect(actual).toEqual(expected_name);
    });
  });

  describe("get_parent", () => {
    describe("when the parent has already been retrieved", () => {
      const expected_parent = "The Parent";
      let folder, actual;
      beforeEach(async done => {
        folder = new Item();
        folder.id = "1234";
        folder.connection = null;
        folder.type = "folder";
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
          folder.retrieve_info = retrieve_info;
          folder.id = "1234";
          folder.connection = null;
          folder.type = "folder";
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
          folder.connection = null;
          folder.type = "folder";
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

  describe("delete", () => {
    describe("when operation is successfull", () => {
      describe("when the item is a folder", () => {
        let connection, folder;
        beforeEach(async () => {
          connection = {
            delete_folder: jest.fn().mockImplementation(() => {
              return new Promise((resolve, reject) => {
                resolve();
              });
            })
          };
          folder = new Item();
          folder.id = "1234";
          folder.type = "folder";
          folder.connection = connection;
          await folder.delete();
        });

        it("calls delete_folder", () => {
          expect(connection.delete_folder).toHaveBeenCalled();
        });
      });

      describe("when the item is a file", () => {
        let connection, file;
        beforeEach(async () => {
          connection = {
            delete_file: jest.fn().mockImplementation(() => {
              return new Promise((resolve, reject) => {
                resolve();
              });
            })
          };
          file = new Item();
          file.id = "1234";
          file.type = "file";
          file.connection = connection;
          await file.delete();
        });

        it("calls delete_file", () => {
          expect(connection.delete_file).toHaveBeenCalled();
        });
      });
    });

    describe("when the operation is unsuccessfull", () => {
      let connection, folder;
      const expected_error = "Oh bother!";
      beforeEach(async () => {
        connection = {
          delete_folder: jest.fn().mockImplementation(() => {
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

      it("rejects with the error", async () => {
        await expect(folder.delete()).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });
});
