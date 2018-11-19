describe("upload_file", () => {
  const expected_resolution = "Some file info";
  let data, func;

  beforeEach(() => {
    data = {
      s3: {
        upload: jest.fn().mockImplementation((params, callback) => {
          callback(null, expected_resolution);
        })
      }
    };
    func = require("../upload_file")(data);
  });

  describe("when provided a file", () => {
    let actual;
    beforeEach(async () => {
      actual = await func(null, "dummy_files/TestFile.txt");
    });

    it("calls data.client.uploadFile", () => {
      expect(data.s3.upload).toHaveBeenCalled();
    });

    it("returns the expected file result", () => {
      expect(actual).toEqual(expected_resolution);
    });
  });

  describe("when provided a folder", () => {
    it("alerts the user", async () => {
      await expect(
        func(null, "dummy_files")
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe("when not provided a file path", () => {
    it("rejects with an error", async () => {
      await expect(func(null, null)).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe("when uploading the file returns an error", () => {
    beforeEach(() => {
      data = {
        s3: {
          upload: jest.fn().mockImplementation((params, callback) => {
            callback(new Error("OH BOTHER!"), null);
          })
        }
      };
      func = require("../upload_file")(data);
    });

    it("rejects with the error", async () => {
      await expect(
        func(null, "dummy_files/TestFile.txt")
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe("when uploading the file to a folder", () => {
    let data;
    const expected_key = "folder/key/path/TestFile.txt";
    beforeEach(async () => {
      data = {
        s3: {
          upload: jest.fn().mockImplementation((params, callback) => {
            callback(null, null);
          })
        }
      };
      func = require("../upload_file")(data);
      await func("folder/key/path", "dummy_files/TestFile.txt");
    });

    it("adds the folder key to the file", async () => {
      expect(data.s3.upload.mock.calls[0][0].Key).toEqual(expected_key);
    });
  });
});
