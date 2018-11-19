describe("list_files", () => {
  const expected_resolution = "watup fam";
  let data, func;

  beforeEach(() => {
    data = {
      s3: {
        listObjects: jest.fn().mockImplementation((params, callback) => {
          callback(null, expected_resolution);
        })
      }
    };
    func = require("../list_files")(data);
  });

  describe("with no folderID", () => {
    let actual;
    beforeEach(done => {
      func().then(res_ => {
        actual = res_;
        done();
      });
    });

    it("calls data.s3.listObjects", () => {
      expect(data.s3.listObjects).toHaveBeenCalled();
    });

    it("passes in correct default parameters", () => {
      expect(data.s3.listObjects.mock.calls[0][0]).toMatchSnapshot();
    });

    it("returns expected resolution", () => {
      expect(actual).toEqual(expected_resolution);
    });
  });

  describe("with folderID", () => {
    let actual;
    beforeEach(done => {
      func("id").then(res_ => {
        actual = res_;
        done();
      });
    });

    it("calls data.client.folders.getItems", () => {
      expect(data.s3.listObjects).toHaveBeenCalled();
    });

    it("passes in correct parameters", () => {
      expect(data.s3.listObjects.mock.calls[0][0]).toMatchSnapshot();
    });

    it("returns expected resolution", () => {
      expect(actual).toEqual(expected_resolution);
    });
  });

  describe("when listObjects throws an error", () => {
    const expected_error = "NOOOOOO";
    beforeEach(() => {
      data.s3.listObjects.mockImplementation((params, callback) => {
        callback(new Error(expected_error), null);
      });
    });

    it("rejects with the error", async () => {
      await expect(func("id")).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
