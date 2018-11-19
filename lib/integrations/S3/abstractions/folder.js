const Item = require("./item");

/**
 * Folder class
 * @constructor
 * @param {String} id - Folder id. "root" for root folder.
 * @param {Object} connection - A connection to a Google Drive integration.
 */
function Folder(id, connection) {
  this.id = id;
  this.type = "folder";
  this.connection = connection;

  //For S3, the name of this folder is the end of the key:
  //If the key is: some/path/to/directory then the folder is called directory
  let split = id.split("/");
  this.name = split[split.length - 1];

  //For S3, for the root folder, this means a key prefix of "" (nothing)
  if (this.id === "root") {
    this.id = "";
    this.name = "Root";
  }
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
      let res = await this.connection.list_all_files(this.id);
      let ret = [];
      for (let i = 0; i < res.Contents.length; i++) {
        ret.push(new File(res.Contents[i].Key, this.connection));
      }
      for (let i = 0; i < res.CommonPrefixes.length; i++) {
        ret.push(
          new Folder(
            res.CommonPrefixes[i].Prefix.substring(
              0,
              res.CommonPrefixes[i].Prefix.length - 1
            ), //Remove the slash at the end
            this.connection
          )
        );
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
      let res = await this.connection.upload_file(this.id, path);
      resolve(new File(res.Key, this.connection));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Creates a new folder inside of this folder
 *
 * @param name Name of folder to create
 * @return {Promise} A promise that returns a folder object when resolved
 */
Folder.prototype.new_folder = function(name) {
  return new Promise(async (resolve, reject) => {
    resolve(new Folder(this.id + "/" + name, this.connection));
  });
};

module.exports = Folder;
