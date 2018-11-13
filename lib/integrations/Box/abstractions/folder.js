const Item = require("./item");

/**
 * Folder class
 * @constructor
 * @param {String} id - Folder id. "root" for root folder.
 * @param {Object} connection - A connection to a Box integration.
 */
function Folder(id, connection) {
  if (id === "root") {
    id = 0;
  }
  this.id = id;
  this.type = "folder";
  this.connection = connection;
}

Folder.prototype = Object.create(Item.prototype);
Folder.prototype.constructor = Folder;

/**
 * List the files in this folder.
 *
 * @return {Promise} A promise that returns a list of files when resolved
 */
Folder.prototype.list_files = function() {
  const File = require("./file");
  return new Promise(async (resolve, reject) => {
    try {
      let res = (await this.connection.list_all_files(this.id)).entries;
      let ret = [];
      for (let i = 0; i < res.length; i++) {
        let f;
        if (res[i].type === "folder") {
          f = new Folder(res[i].id, this.connection);
        } else {
          f = new File(res[i].id, this.connection);
        }
        f.name = res[i].name;
        ret.push(f);
      }
      resolve(ret);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Upload a local file to this folder.
 *
 * @param path path to local file to upload
 * @return {Promise} A promise that returns a file object when resolved
 */
Folder.prototype.upload_file = function(path) {
  const File = require("./file");
  return new Promise(async (resolve, reject) => {
    try {
      let res = (await this.connection.upload_file(this.id, path)).entries[0];
      resolve(new File(res.id, this.connection));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = Folder;
