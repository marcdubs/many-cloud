const BoxFile = require("../integrations/Box/abstractions/file");
const GoogleDriveFile = require("../integrations/GoogleDrive/abstractions/file");

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
  }
}

module.exports = File;
