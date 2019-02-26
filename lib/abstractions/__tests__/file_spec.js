const File = require("../file");

describe("file", () => {
  describe("constructor", () => {
    describe("when connection type is Box", () => {
      let file;
      beforeEach(() => {
        let connection = {
          type: "Box"
        };
        file = new File("1", connection);
      });

      it("returns a BoxFile", () => {
        expect(file).toBeInstanceOf(
          require("../../integrations/Box/abstractions/file.js")
        );
      });
    });

    describe("when connection type is GoogleDrive", () => {
      let file;
      beforeEach(() => {
        let connection = {
          type: "GoogleDrive"
        };
        file = new File("1", connection);
      });

      it("returns a GoogleDriveFile", () => {
        expect(file).toBeInstanceOf(
          require("../../integrations/GoogleDrive/abstractions/file.js")
        );
      });
    });

    describe("when connection type is S3", () => {
      let file;
      beforeEach(() => {
        let connection = {
          type: "S3"
        };
        file = new File("1", connection);
      });

      it("returns a S3DriveFile", () => {
        expect(file).toBeInstanceOf(
          require("../../integrations/S3/abstractions/file.js")
        );
      });
    });

    describe("when connection type is something else", () => {
      let connection;
      beforeEach(() => {
        connection = {
          type: "idk"
        };
      });

      it("throws an error", () => {
        expect(() => {
          new File("1", connection);
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
