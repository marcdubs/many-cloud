const BoxFolder = require("../integrations/Box/abstractions/folder");
const GoogleDriveFolder = require("../integrations/GoogleDrive/abstractions/folder");
const S3DriveFolder = require("../integrations/S3/abstractions/folder");
const Item = require("./item");

const File = require("./file");

/** Class representing an abstract folder from any cloud provider */
class Folder extends Item {
  /**
   * Create a folder handle
   * @param {String} id - Folder id. "root" for root folder.
   * @param {Object} connection - A connection to an integration.
   */
  constructor(id, connection, internal) {
    super();

    if (internal) {
      this.internal = internal;
      return;
    }

    if (connection.type === "Box") {
      this.internal = new BoxFolder(id, connection);
    } else if (connection.type === "GoogleDrive") {
      this.internal = new GoogleDriveFolder(id, connection);
    } else if (connection.type === "S3") {
      this.internal = new S3DriveFolder(id, connection);
    } else {
      throw new Error("Unrecognized connection type: " + connection.type);
    }
  }

  /**
   * List the files in this folder.
   *
   * @return {Array[File]} A promise that returns a list of files when resolved
   */
  async list_files() {
    let files = await this.internal.list_files();
    for (let i = 0; i < files.length; i++) {
      files[i] = new File(files[i].id, files[i].connection, files[i]);
    };

    return files;
  }

  /**
   * Upload a local file to this folder.
   *
   * @param path path to local file to upload
   * @return {File} A promise that returns a file object when resolved
   */
  async upload_file(path) {
    let file_internal = await this.internal.upload_file(path);
    return new File(file_internal.id, file_internal.connection, file_internal);
  }

  /**
   * Creates a new folder inside of this folder
   *
   * @param name Name of folder to create
   * @return {Folder} A promise that returns a folder object when resolved
   */
  async new_folder(name) {
    let folder_internal = await this.internal.new_folder(name);
    return new Folder(folder_internal.id, folder_internal.connection, folder_internal);
  }
}

module.exports = Folder;
