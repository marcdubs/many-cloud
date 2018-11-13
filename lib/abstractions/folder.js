const BoxFolder = require("../integrations/Box/abstractions/folder");
const GoogleDriveFolder = require("../integrations/GoogleDrive/abstractions/folder");

/**
 * Folder class
 * @constructor
 * @param {String} id - Folder id. "root" for root folder.
 * @param {Object} connection - A connection to an integration.
 */
function Folder(id, connection) {
  if (connection.type === "Box") {
    return new BoxFolder(id, connection);
  } else if (connection.type === "GoogleDrive") {
    return new GoogleDriveFolder(id, connection);
  }
}

module.exports = Folder;