const File = require("../file");

describe("file", () => {
  describe("constructor", () => {
    const expected_id = "1234",
      expected_connection = "the_connection",
      expected_type = "file";
    let actual;
    beforeEach(() => {
      actual = new File(expected_id, expected_connection);
    });

    it("sets the id", () => {
      expect(actual.id).toEqual(expected_id);
    });

    it("sets the connection", () => {
      expect(actual.connection).toEqual(expected_connection);
    });

    it("sets the type", () => {
      expect(actual.type).toEqual(expected_type);
    });
  });

  describe("download_to", () => {
    describe("when successfull", () => {
      let file, connection;
      beforeEach(async done => {
        connection = {
          download_file: jest.fn().mockImplementation(() => {
            return new Promise(resolve => {
              resolve();
            });
          })
        };
        file = new File("1234", connection);
        await file.download_to("destination");
        done();
      });

      it("calls connection.download_file", () => {
        expect(connection.download_file).toHaveBeenCalled();
      });
    });

    describe("when unsuccessfull", () => {
      const expected_error = "Well'a look what you did done did!";
      let file, connection;
      beforeEach(() => {
        connection = {
          download_file: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              reject(new Error(expected_error));
            });
          })
        };
        file = new File("1234", connection);
      });

      it("rejects with the error", async () => {
        await expect(
          file.download_to("destination")
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe("checksum", () => {
    describe("when checksum exists", () => {
      let file;
      const expected_checksum = "DAFILEASNCHANGED";
      beforeEach(() => {
        file = new File("1234", null);
        file.checksum = expected_checksum;
      });

      it("resolves with the checksum", async () => {
        await expect(file.get_checksum()).resolves.toEqual(expected_checksum);
      });
    });

    describe("when checksum doesn't exists", () => {
      let file, actual;
      const expected_checksum = "DAFILEASNCHANGED";
      beforeEach(async () => {
        file = new File("1234", null);
        file.retrieve_info = jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            file.checksum = expected_checksum;
            resolve();
          });
        });
        actual = await file.get_checksum();
      });

      it("calls retrieve_info to get checksum", () => {
        expect(file.retrieve_info).toHaveBeenCalled();
      });

      it("resolves with the checksum", () => {
        expect(actual).toEqual(expected_checksum);
      });
    });

    describe("when checksum doesn't exists and retrieve_info throws an exception", () => {
      let file, actual;
      const expected_error = "darn";
      beforeEach(() => {
        file = new File("1234", null);
        file.retrieve_info = jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            reject(new Error(expected_error));
          });
        });
      });

      it("rejects with the error", async () => {
        await expect(
          file.get_checksum()
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    });
  });
});
