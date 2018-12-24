describe("download_file", () => {
  describe("when the file is downloaded successfully", () => {
    const expected_dest = "some_file_dest.extension",
      expected_data = "some_file_data",
      expected_file_id = "1234";
    let func, data, fs, result;
    beforeEach(async done => {
      fs = require("fs");
      fs.writeFile = jest.fn().mockImplementation((dest, body, callback) => {
        callback(null);
      });

      data = {
        s3: {
          getObject: jest.fn().mockImplementation((params, callback) => {
            callback(null, { Body: expected_data });
          })
        }
      };
      func = require("../download_file")(data);
      result = await func(expected_file_id, expected_dest);
      done();
    });

    it("calls fs.writeFile with dest and data", () => {
      expect(fs.writeFile).toHaveBeenCalledWith(
        expected_dest,
        expected_data,
        expect.any(Function)
      );
    });

    it("returns undefined", () => {
      expect(result).toBeUndefined();
    });
  });

  describe("when fs.writeFile returns an error", () => {
    const expected_error =
      "It's a lot of bad things That they wishin' and wishin' and wishin' and wishin' They wishin' on me Yuh, ayy, ayy";
    beforeEach(() => {
      fs = require("fs");
      fs.writeFile = jest.fn().mockImplementation((dest, body, callback) => {
        callback(new Error(expected_error));
      });
      data = {
        s3: {
          getObject: jest.fn().mockImplementation((params, callback) => {
            callback(null, { Body: null });
          })
        }
      };
      func = require("../download_file")(data);
    });

    it("rejects with the error", async () => {
      await expect(func()).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe("when getObject returns an error", () => {
    const expected_error = "You Done Messed Up A-Aron!";
    beforeEach(() => {
      data = {
        s3: {
          getObject: jest.fn().mockImplementation((params, callback) => {
            callback(new Error(expected_error));
          })
        }
      };
      func = require("../download_file")(data);
    });

    it("rejects with the error", async () => {
      await expect(func()).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
