describe("delete_folder", () => {
  describe("when operation is successfull", () => {
    const expected_resolution = "Some folder info";
    let func, data;
    beforeEach(() => {
      data = {
        client: {
          folders: {
            delete: jest.fn().mockImplementation(() => {
              return new Promise((resolve, reject) => {
                resolve(expected_resolution);
              });
            })
          }
        }
      };
      func = require("../delete_folder")(data);
    });

    it("resolves with the expected resolution", async () => {
      await expect(func()).resolves.toEqual(expected_resolution);
    });
  });

  describe("when operation is unsuccessfull", () => {
    let func, data;
    beforeEach(() => {
      data = {
        client: {
          folders: {
            delete: jest.fn().mockImplementation(() => {
              return new Promise((resolve, reject) => {
                reject(new Error("That didn't work!"));
              });
            })
          }
        }
      };
      func = require("../delete_folder")(data);
    });

    it("rejects with the error", async () => {
      await expect(func()).rejects.toMatchSnapshot();
    });
  });
});
