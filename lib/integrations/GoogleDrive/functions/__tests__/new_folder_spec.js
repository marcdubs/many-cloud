describe("new_folder", () => {
  describe("when operation is successfull", () => {
    const expected_resolution = "Some folder info";
    let func, data;
    beforeEach(() => {
      data = {
        drive: {
          files: {
            create: jest.fn().mockImplementation((meta, callback) => {
              callback(null, { data: expected_resolution });
            })
          }
        }
      };
      func = require("../new_folder")(data);
    });

    it("resolves with the expected resolution", async () => {
      await expect(func()).resolves.toEqual(expected_resolution);
    });
  });

  describe("when operation is unsuccessfull", () => {
    let func, data;
    beforeEach(() => {
      data = {
        drive: {
          files: {
            create: jest.fn().mockImplementation((meta, callback) => {
              callback("OOOOH NOOOOO!");
            })
          }
        }
      };
      func = require("../new_folder")(data);
    });

    it("rejects with the error", async () => {
      await expect(func()).rejects.toMatchSnapshot();
    });
  });

  describe("when provided a parentID", () => {
    const expected_resolution = "Some folder info";
    const expected_parentID = "some_parent";
    let func, data;
    beforeEach(async done => {
      data = {
        drive: {
          files: {
            create: jest.fn().mockImplementation((meta, callback) => {
              callback(null, { data: expected_resolution });
            })
          }
        }
      };
      func = require("../new_folder")(data);
      await func(expected_parentID);
      done();
    });

    it("calls the create function with the parentID", () => {
      expect(
        data.drive.files.create.mock.calls[0][0].resource.parents[0]
      ).toEqual(expected_parentID);
    });
  });

  describe("when data.drive is null", () => {
    const expected_resolution = "Some folder info";
    let func, data;
    beforeEach(async done => {
      data = {
        setup_drive: jest.fn().mockImplementation(() => {
          data.drive = {
            files: {
              create: jest.fn().mockImplementation((meta, callback) => {
                callback(null, { data: expected_resolution });
              })
            }
          };
        })
      };
      func = require("../new_folder")(data);
      await func();
      done();
    });

    it("calls the data.setup_drive function", () => {
      expect(data.setup_drive).toHaveBeenCalled();
    });
  });
});
