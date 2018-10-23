describe("list_all_files", () => {
  const expected_resolution = "watup fam";
  let data, func;

  beforeEach(() => {
    var counter = 0;
    data = {
      client: {
        folders: {
          getItems: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              if (counter >= 10) {
                resolve([]);
                return;
              }
              resolve([expected_resolution + counter]);
              counter++;
            });
          })
        }
      }
    };
    let list_files = require("../list_files")(data);
    func = require("../list_all_files")(data, list_files);
  });

  describe("when there are no errors", () => {
    let actual;
    beforeEach(done => {
      func("id").then(res_ => {
        actual = res_;
        done();
      });
    });

    it("calls data.client.folders.getItems", () => {
      expect(data.client.folders.getItems).toHaveBeenCalled();
    });

    it("passes in correct default parameters", () => {
      expect(data.client.folders.getItems.mock.calls[0][1]).toMatchSnapshot();
    });

    it("returns expected resolution", () => {
      expect(actual).toMatchSnapshot();
    });
  });

  describe("when getItems throws an error", () => {
    const expected_error = "NOOOOOO";
    beforeEach(() => {
      data.client.folders.getItems.mockImplementation(() => {
        return new Promise((resolve, reject) => {
          throw new Error(expected_error);
        });
      });
    });

    it("rejects with the error", async () => {
      await expect(func("id")).rejects.toThrowErrorMatchingSnapshot();
    });
  });
});
