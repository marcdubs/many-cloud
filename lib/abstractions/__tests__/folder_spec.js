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

      it("sets internal to a BoxFolder", () => {
        expect(folder.internal).toBeInstanceOf(
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

      it("sets internal to a GoogleDriveFolder", () => {
        expect(folder.internal).toBeInstanceOf(
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

      it("sets internal to a S3DriveFolder", () => {
        expect(folder.internal).toBeInstanceOf(
          require("../../integrations/S3/abstractions/folder.js")
        );
      });
    });

    describe("when connection type is AzureFileShare", () => {
      let folder;
      beforeEach(async () => {
        let AzureFileShareIntegration = require("../../integrations/AzureFileShare/index");
        let connection = await AzureFileShareIntegration({ account: "1", accountKey: "1", shareURL: "http://example.com/1" });
        folder = new Folder("root", connection);
      });

      it("sets internal to a AzureFileShareFolder", () => {
        expect(folder.internal).toBeInstanceOf(
          require("../../integrations/AzureFileShare/abstractions/folder.js")
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
