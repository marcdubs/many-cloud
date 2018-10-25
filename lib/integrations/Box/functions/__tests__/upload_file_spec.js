describe("upload_file", () => {
  const expected_resolution = "Some file info";
  let data, func;

  beforeEach(() => {
    data = {
      client: {
        files: {
          uploadFile: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              resolve(expected_resolution);
            });
          })
        }
      }
    };
    func = require("../upload_file")(data);
  });

  describe("when provided a file", () => {
    let actual;
    beforeEach(async () => {
      actual = await func(0, "dummy_files/TestFile.txt");
    });

    it("calls data.client.uploadFile", () => {
      expect(data.client.files.uploadFile).toHaveBeenCalled();
    });

    it("returns the expected file result", () => {
      expect(actual).toEqual(expected_resolution);
    });
  });

  describe("when provided a folder", () => {
    it("alerts the user to use upload_folder instead", async () => {
      await expect(
        func(0, "dummy_files")
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe("when not provided a file path", () => {
    it("rejects with an error", async () => {
      await expect(func(0, null)).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  describe("when uploading the file returns an error", () => {
    beforeEach(() => {
      data = {
        client: {
          files: {
            uploadFile: jest.fn().mockImplementation(() => {
              return new Promise((resolve, reject) => {
                throw new Error(
                  "Something absolutely terrible happened. Oh no."
                );
              });
            })
          }
        }
      };
      func = require("../upload_file")(data);
    });

    it("rejects with the error", async () => {
      await expect(
        func(0, "dummy_files/TestFile.txt")
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
