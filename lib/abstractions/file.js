const BoxFile = require("../integrations/Box/abstractions/file");

/**
 * File class
 * @constructor
 * @param {String} id - File id.
 * @param {Object} connection - A connection to an integration.
 */
function File(id, connection) {
  if (connection.type === "Box") {
    return new BoxFile(id, connection);
  }
}

module.exports = File;
