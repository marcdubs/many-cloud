describe("get_folder_info", () => {
  describe("when the operation is successfull", () => {
    const expected_result = "folder_info";
    let data, func;
    beforeEach(() => {
      data = {
        client: {
          folders: {
            get: jest.fn().mockImplementation(() => {
              return expected_result;
            })
          }
        }
      };
      func = require("../get_folder_info")(data);
    });

    it("returns the expected result", async () => {
      await expect(func("1234")).resolves.toEqual(expected_result);
    });
  });

  describe("when the operation throws an error", () => {
    const expected_error = "Look what you did!";
    let data, func;
    beforeEach(() => {
      data = {
        client: {
          folders: {
            get: jest.fn().mockImplementation(() => {
              throw new Error(expected_error);
            })
          }
        }
      };
      func = require("../get_folder_info")(data);
    });

    it("rejects with the error", async () => {
      await expect(func("1234")).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
