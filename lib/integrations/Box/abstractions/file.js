const Item = require("./item");

/**
 * File class
 * @constructor
 * @param {String} id - File id.
 * @param {Object} connection - A connection to a Box integration.
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

/**
 * Gets a checksum (sha1 or md5, etc depending on implementation)
 *
 * @return {Promise} Resolves with the checksum.
 */
File.prototype.get_checksum = function() {
  return new Promise(async (resolve, reject) => {
    if (!this.checksum) {
      try {
        await this.retrieve_info();
      } catch (err) {
        reject(err);
        return;
      }
    }
    resolve(this.checksum);
  });
};

module.exports = File;
