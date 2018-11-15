describe("delete_file", () => {
  const expected_resolution = "Some file info";
  let data, func;

  beforeEach(() => {
    data = {
      s3: {
        deleteObject: jest.fn().mockImplementation((params, callback) => {
          callback(null, expected_resolution);
        })
      }
    };
    func = require("../delete_file")(data);
  });

  describe("when the deletion is successfull", () => {
    let actual;
    beforeEach(async () => {
      actual = await func(1234);
    });

    it("returns the expected resolution", () => {
      expect(actual).toEqual(expected_resolution);
    });
  });

  describe("when the deletion returns an error", () => {
    beforeEach(() => {
      data = {
        s3: {
          deleteObject: jest.fn().mockImplementation((params, callback) => {
            callback(new Error("Call Jeff Bezos"));
          })
        }
      };
      func = require("../delete_file")(data);
    });

    it("rejects with the same error", async () => {
      await expect(func(1234)).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
