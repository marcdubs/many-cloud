const BoxFile = require("../integrations/Box/abstractions/file");
const GoogleDriveFile = require("../integrations/GoogleDrive/abstractions/file");
const S3DriveFile = require("../integrations/S3/abstractions/file");

/**
 * File class
 * @constructor
 * @param {String} id - File id.
 * @param {Object} connection - A connection to an integration.
 */
function File(id, connection) {
  if (connection.type === "Box") {
    return new BoxFile(id, connection);
  } else if (connection.type === "GoogleDrive") {
    return new GoogleDriveFile(id, connection);
  } else if (connection.type === "S3") {
    return new S3DriveFile(id, connection);
  }
  throw new Error("Unrecognized connection type: " + connection.type);
}

module.exports = File;
