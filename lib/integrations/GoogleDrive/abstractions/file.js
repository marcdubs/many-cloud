const Folder = require("./folder");

/**
 * File class
 * @constructor
 * @param {String} id - File id.
 * @param {Object} connection - A connection to a Google Drive integration.
 */
function File(id, connection) {
  this.id = id;
  this.type = "file";
  this.connection = connection;
}

module.exports = File;
