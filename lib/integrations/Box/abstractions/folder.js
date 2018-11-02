const File = require("./file");

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

/**
 * List the files in this folder.
 *
 * @return {Promise}
 */
Folder.prototype.list_files = function() {
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
 * Retrieves info for this folder and adds that info to the object.
 *
 * @return {Promise}
 */
Folder.prototype.retrieve_info = function() {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await this.connection.get_folder_info(this.id);
      this.name = result.name;
      if (result.parent) {
        this.parent = new Folder(result.parent.id, this.connection);
        this.parent.name = result.parent.name;
      } else {
        this.parent = null;
      }
      this.size = result.size;
      this.trashed = result.trashed_at != null;
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Get the name of this folder.
 *
 * @return {Promise}
 */
Folder.prototype.get_name = function() {
  return new Promise(async (resolve, reject) => {
    if (!this.name) {
      try {
        await this.retrieve_info();
      } catch (err) {
        reject(err);
        return;
      }
    }
    resolve(this.name);
  });
};

/**
 * Get the parent folder of this folder or null if there isn't one.
 *
 * @return {Folder}
 */
Folder.prototype.get_parent = function() {
  return new Promise(async (resolve, reject) => {
    if (this.parent == undefined) {
      try {
        await this.retrieve_info();
      } catch (err) {
        reject(err);
        return;
      }
    }
    resolve(this.parent);
  });
};

module.exports = Folder;
