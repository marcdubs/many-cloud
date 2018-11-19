describe("list_all_files", () => {
  describe("when not provided a folderID", () => {
    const expected_marker = "WASUP";
    let data, actual;
    beforeEach(async () => {
      data = {
        s3: {
          listObjects: jest.fn().mockImplementation((params, callback) => {
            if (params.Marker === expected_marker) {
              callback(null, {
                IsTruncated: false,
                Contents: ["Thing2"],
                CommonPrefixes: []
              });
            } else {
              callback(null, {
                IsTruncated: true,
                NextMarker: expected_marker,
                Contents: ["Thing1"],
                CommonPrefixes: []
              });
            }
          })
        }
      };
      actual = await require("../list_all_files")(data)(null);
    });

    it("calls data.s3.listObjects twice", () => {
      expect(data.s3.listObjects).toHaveBeenCalledTimes(2);
    });

    it("returns the expected contents", () => {
      expect(actual.Contents).toMatchSnapshot();
    });
  });

  describe("when provided a folderID", () => {
    const expected_marker = "WASUP";
    let data, actual;
    beforeEach(async () => {
      data = {
        s3: {
          listObjects: jest.fn().mockImplementation((params, callback) => {
            if (params.Marker === expected_marker) {
              callback(null, {
                IsTruncated: false,
                Contents: ["Thing2"],
                CommonPrefixes: ["SomeFolder"]
              });
            } else {
              callback(null, {
                IsTruncated: true,
                NextMarker: expected_marker,
                Contents: ["Thing1"],
                CommonPrefixes: []
              });
            }
          })
        }
      };
      actual = await require("../list_all_files")(data)("folder");
    });

    it("calls data.s3.listObjects twice", () => {
      expect(data.s3.listObjects).toHaveBeenCalledTimes(2);
    });

    it("calls data.s3.listObjects with the folder as the key prefix", () => {
      expect(data.s3.listObjects.mock.calls).toMatchSnapshot();
    });

    it("returns the expected contents", () => {
      expect(actual.Contents).toMatchSnapshot();
    });
  });

  describe("when listObject throws an error the second time it is called", () => {
    const expected_marker = "WASUP";
    const expected_error = "OH BOTHER!";
    let data, actual;
    beforeEach(() => {
      data = {
        s3: {
          listObjects: jest.fn().mockImplementation((params, callback) => {
            if (params.Marker === expected_marker) {
              callback(new Error(expected_error), null);
            } else {
              callback(null, {
                IsTruncated: true,
                NextMarker: expected_marker,
                Contents: ["Thing1"],
                CommonPrefixes: []
              });
            }
          })
        }
      };
    });

    it("returns with the error", async () => {
      let func = require("../list_all_files")(data);
      await expect(func(null)).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
