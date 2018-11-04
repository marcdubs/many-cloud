const Item = require("./item");

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

File.prototype = Object.create(Item.prototype);
File.prototype.constructor = File;

/**
 * Downloads this file to specified location
 * @param {String} path - Path to destination.
 *
 * @return {Promise}
 */
File.prototype.download_to = function(path) {
  return new Promise(async (resolve, reject) => {
    try {
      await this.connection.download_file(this.id, path);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = File;
