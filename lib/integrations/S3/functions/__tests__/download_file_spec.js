describe("download_file", () => {
  describe("when the file is downloaded successfully", () => {
    const expected_dest = "some_file_dest.extension",
      expected_file_id = "1234",
      expected_output = "some_file_data";
    let func, data, stream, fs, result, createReadStream;
    beforeEach(async done => {
      fs = require("fs");
      fs.createWriteStream = jest.fn().mockImplementation(() => {
        return expected_output;
      });
      stream = {
        pipe: jest.fn()
      };

      createReadStream = jest.fn().mockImplementation(() => {
        return stream;
      });

      data = {
        s3: {
          getObject: jest.fn().mockImplementation(() => {
            return { createReadStream: createReadStream };
          })
        }
      };
      func = require("../download_file")(data);
      result = await func(expected_file_id, expected_dest);
      done();
    });

    it("calls fs.createWriteStream with dest", () => {
      expect(fs.createWriteStream).toHaveBeenCalledWith(expected_dest);
    });

    it("calls stream.pipe with what createWriteStream returned", () => {
      expect(stream.pipe).toHaveBeenCalledWith(expected_output);
    });

    it("returns undefined", () => {
      expect(result).toBeUndefined();
    });
  });

  describe("when it returns an error", () => {
    const expected_error =
      "It's a lot of bad things That they wishin' and wishin' and wishin' and wishin' They wishin' on me Yuh, ayy, ayy";
    beforeEach(() => {
      data = {
        s3: {
          getObject: jest.fn().mockImplementation(() => {
            return {
              createReadStream: jest.fn().mockImplementation(() => {
                return {
                  pipe: jest.fn().mockImplementation(() => {
                    throw new Error(expected_error);
                  })
                };
              })
            };
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
