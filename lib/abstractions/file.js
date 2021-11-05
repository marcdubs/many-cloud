const BoxFile = require("../integrations/Box/abstractions/file");
const GoogleDriveFile = require("../integrations/GoogleDrive/abstractions/file");
const S3DriveFile = require("../integrations/S3/abstractions/file");

const Item = require("./item");

/** Class representing an abstract file from any cloud provider */
class File extends Item {
  /**
   * Create a file handle
   * @param {String} id - File id.
   * @param {Object} connection - A connection to an integration.
   */
  constructor(id, connection, internal) {
    super();

    if (internal) {
      this.internal = internal;
      return;
    }

    if (connection.type === "Box") {
      this.internal = new BoxFile(id, connection);
    } else if (connection.type === "GoogleDrive") {
      this.internal = new GoogleDriveFile(id, connection);
    } else if (connection.type === "S3") {
      this.internal = new S3DriveFile(id, connection);
    } else {
      throw new Error("Unrecognized connection type: " + connection.type);
    }
  }

  /**
   * Gets a checksum as a string for this file. It will be in whatever format the cloud
   * storage utilizes. Usually MD5.
   * @returns {String}
   */
  async get_checksum() {
    return await this.internal.get_checksum();
  }

  /**
   * Downloads this file to specified location
   * @param {String} path - Path to destination.
   *
   * @return {Promise}
   */
  async download_to(path) {
    return await this.internal.download_to(path);
  }
}

module.exports = File;
