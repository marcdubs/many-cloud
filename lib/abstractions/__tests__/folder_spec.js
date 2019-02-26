const Folder = require("../folder");

describe("folder", () => {
  describe("constructor", () => {
    describe("when connection type is Box", () => {
      let folder;
      beforeEach(() => {
        let connection = {
          type: "Box"
        };
        folder = new Folder("root", connection);
      });

      it("returns a BoxFolder", () => {
        expect(folder).toBeInstanceOf(
          require("../../integrations/Box/abstractions/folder.js")
        );
      });
    });

    describe("when connection type is GoogleDrive", () => {
      let fplder;
      beforeEach(() => {
        let connection = {
          type: "GoogleDrive"
        };
        folder = new Folder("root", connection);
      });

      it("returns a GoogleDriveFolder", () => {
        expect(folder).toBeInstanceOf(
          require("../../integrations/GoogleDrive/abstractions/folder.js")
        );
      });
    });

    describe("when connection type is S3", () => {
      let folder;
      beforeEach(() => {
        let connection = {
          type: "S3"
        };
        folder = new Folder("root", connection);
      });

      it("returns a S3DriveFolder", () => {
        expect(folder).toBeInstanceOf(
          require("../../integrations/S3/abstractions/folder.js")
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
          new Folder("root", connection);
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
