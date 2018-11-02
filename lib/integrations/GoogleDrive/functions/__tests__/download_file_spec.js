describe("download_file", () => {
  describe("when the file is downloaded successfully", () => {
    const expected_dest = "where_to_pipe",
      expected_filePath = "sup.png",
      expected_file_id = "1234";
    let data, fs, ret, func, result;
    beforeEach(async done => {
      fs = require("fs");
      fs.createWriteStream = jest.fn().mockImplementation(() => {
        return expected_dest;
      });
      ret = {
        data: {
          pipe: jest.fn()
        }
      };

      data = {
        drive: {
          files: {
            get: jest.fn().mockImplementation((first, second, callback) => {
              callback(null, ret);
            })
          }
        }
      };
      func = require("../download_file")(data);
      result = await func(expected_file_id, expected_filePath);
      done();
    });

    it("calls fs.createWriteStream with filePath", () => {
      expect(fs.createWriteStream).toHaveBeenCalledWith(expected_filePath);
    });

    it("calls data.drive.files.get with fileID", () => {
      expect(data.drive.files.get.mock.calls[0][0].fileId).toEqual(
        expected_file_id
      );
    });

    it("calls res.data.pipe with the destination", () => {
      expect(ret.data.pipe).toHaveBeenCalledWith(expected_dest);
    });

    it("resolves with undefined", () => {
      expect(result).toBeUndefined();
    });
  });

  describe("when data.drive is undefined", () => {
    const expected_dest = "where_to_pipe",
      expected_filePath = "sup.png",
      expected_file_id = "1234";
    let data, fs, ret, func, result;
    beforeEach(async done => {
      fs = require("fs");
      fs.createWriteStream = jest.fn().mockImplementation(() => {
        return expected_dest;
      });
      ret = {
        data: {
          pipe: jest.fn()
        }
      };

      data = {
        setup_drive: jest.fn().mockImplementation(() => {
          data.drive = {
            files: {
              get: jest.fn().mockImplementation((first, second, callback) => {
                callback(null, ret);
              })
            }
          };
        })
      };
      func = require("../download_file")(data);
      result = await func(expected_file_id, expected_filePath);
      done();
    });

    it("calls setup_drive", () => {
      expect(data.setup_drive).toHaveBeenCalled();
    });
  });

  describe("when the get operation returns an error", () => {
    const expected_error = "Something went wrong!",
      expected_dest = "where_to_pipe";
    let data, func, fs;
    beforeEach(() => {
      fs = require("fs");
      fs.createWriteStream = jest.fn().mockImplementation(() => {
        return expected_dest;
      });
      data = {
        drive: {
          files: {
            get: jest.fn().mockImplementation((first, second, callback) => {
              callback(new Error(expected_error));
            })
          }
        }
      };
      func = require("../download_file")(data);
    });

    it("rejects with the error", async () => {
      await expect(func()).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
