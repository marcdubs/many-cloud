describe("list_files", () => {
  const expected_resolution = "watup fam";
  let data, func;

  beforeEach(() => {
    data = {
      client: {
        folders: {
          getItems: jest.fn().mockImplementation(() => {
            return new Promise((resolve, reject) => {
              resolve(expected_resolution);
            });
          })
        }
      }
    };
    func = require("../list_files")(data);
  });

  describe("with no page_size or offset", () => {
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
      expect(actual).toEqual(expected_resolution);
    });
  });

  describe("with page_size and offset", () => {
    let actual;
    beforeEach(done => {
      func("id", 13, 25).then(res_ => {
        actual = res_;
        done();
      });
    });

    it("calls data.client.folders.getItems", () => {
      expect(data.client.folders.getItems).toHaveBeenCalled();
    });

    it("passes in correct parameters", () => {
      expect(data.client.folders.getItems.mock.calls[0][1]).toMatchSnapshot();
    });

    it("returns expected resolution", () => {
      expect(actual).toEqual(expected_resolution);
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
