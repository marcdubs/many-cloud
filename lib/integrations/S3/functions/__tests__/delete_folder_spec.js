describe("delete_folder", () => {
  describe("when all operations are successfull", () => {
    const initial_folder_key = "first_folder";
    const recursive_folder_key = "second_folder";
    let func, data, result, delete_file_fn;
    beforeEach(async () => {
      delete_file_fn = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          resolve();
        });
      });

      data = {
        list_all_files: jest.fn().mockImplementation(folderID => {
          return new Promise((resolve, reject) => {
            if (folderID === initial_folder_key) {
              resolve({
                Contents: [{ Key: "first_file" }, { Key: "second_file" }],
                CommonPrefixes: [{ Prefix: recursive_folder_key + "/" }]
              });
            } else if (folderID === recursive_folder_key) {
              resolve({
                Contents: [
                  { Key: "recursive_first_file" },
                  { Key: "recursive_second_file" }
                ],
                CommonPrefixes: []
              });
            }
          });
        }),
        delete_file: delete_file_fn
      };
      func = require("../delete_folder")(data);
      result = await func(initial_folder_key);
    });

    it("resolves with undefined", () => {
      expect(result).toBeUndefined();
    });

    it("calls list_all_files twice", () => {
      expect(data.list_all_files).toHaveBeenCalledTimes(2);
    });

    it("calls delete_file with all files that should be deleted", () => {
      expect(delete_file_fn.mock.calls).toMatchSnapshot();
    });
  });

  describe("when list_all_files throws an error", () => {
    const expected_error = "we do what we must because we can";
    let func, data;
    beforeEach(() => {
      data = {
        list_all_files: jest.fn().mockImplementation(folderID => {
          return new Promise((resolve, reject) => {
            reject(new Error(expected_error));
          });
        })
      };
      func = require("../delete_folder")(data);
    });

    it("rejects with the error", async () => {
      await expect(func("1234")).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
