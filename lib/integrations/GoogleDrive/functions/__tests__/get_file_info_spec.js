describe("get_file_info", () => {
  describe("when the operation is successfull and params are null", () => {
    const expected_result = "api_result",
      expected_file_id = "1234";
    let data, func, actual;
    beforeEach(async done => {
      data = {
        setup_drive: jest.fn().mockImplementation(() => {
          data.drive = {
            files: {
              get: jest.fn().mockImplementation((params, callback) => {
                callback(null, { data: expected_result });
              })
            }
          };
        })
      };
      func = require("../get_file_info")(data);
      actual = await func(expected_file_id, null);
      done();
    });

    it("calls setup_drive", () => {
      expect(data.setup_drive).toHaveBeenCalled();
    });

    it("calls data.drive.files.get with fileID", () => {
      expect(data.drive.files.get.mock.calls[0][0].fileId).toEqual(
        expected_file_id
      );
    });

    it("calls data.drive.files.get with default params", () => {
      expect(data.drive.files.get.mock.calls[0][0].fields).toMatchSnapshot();
    });
  });

  describe("when the operation is successfull and params are passed in explicitly", () => {
    const expected_result = "api_result",
      expected_file_id = "1234",
      expected_params = "md5Checksum";
    let data, func, actual;
    beforeEach(async done => {
      data = {
        drive: {
          files: {
            get: jest.fn().mockImplementation((params, callback) => {
              callback(null, { data: expected_result });
            })
          }
        }
      };
      func = require("../get_file_info")(data);
      actual = await func(expected_file_id, expected_params);
      done();
    });

    it("calls data.drive.files.get with fileID", () => {
      expect(data.drive.files.get.mock.calls[0][0].fileId).toEqual(
        expected_file_id
      );
    });

    it("calls data.drive.files.get with expected params", () => {
      expect(data.drive.files.get.mock.calls[0][0].fields).toEqual(
        expected_params
      );
    });
  });

  describe("when the operation is unsuccessfull", () => {
    const expected_error = "Oh boy!";
    let data, func, actual;
    beforeEach(() => {
      data = {
        setup_drive: jest.fn().mockImplementation(() => {
          data.drive = {
            files: {
              get: jest.fn().mockImplementation((params, callback) => {
                callback(expected_error);
              })
            }
          };
        })
      };
      func = require("../get_file_info")(data);
    });

    it("rejects with the error", async () => {
      await expect(func()).rejects.toMatchSnapshot();
    });
  });
});
