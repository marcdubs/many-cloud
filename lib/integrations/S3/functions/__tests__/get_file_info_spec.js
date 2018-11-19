describe("get_file_info", () => {
  describe("when the operation is successfull", () => {
    const expected_result = "api_result",
      expected_file_id = "1234";
    let data, func, actual;
    beforeEach(async done => {
      data = {
        s3: {
          headObject: jest.fn().mockImplementation((params, callback) => {
            callback(null, expected_result);
          })
        }
      };
      func = require("../get_file_info")(data);
      actual = await func(expected_file_id);
      done();
    });

    it("calls headObject", () => {
      expect(data.s3.headObject).toHaveBeenCalled();
    });

    it("calls headObject with fileID", () => {
      expect(data.s3.headObject.mock.calls[0][0].Key).toEqual(expected_file_id);
    });
  });

  describe("when the operation is unsuccessfull", () => {
    const expected_error = "Oh boy!";
    let data, func, actual;
    beforeEach(() => {
      data = {
        s3: {
          headObject: jest.fn().mockImplementation((params, callback) => {
            callback(new Error(expected_error), null);
          })
        }
      };
      func = require("../get_file_info")(data);
    });

    it("rejects with the error", async () => {
      await expect(func()).rejects.toMatchSnapshot();
    });
  });
});
