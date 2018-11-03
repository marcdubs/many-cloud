const File = require("./file");

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
}

/**
 * List the files in this folder.
 *
 * @return {Promise}
 */
Folder.prototype.list_files = function() {
  return new Promise(async (resolve, reject) => {
    try {
      let res = (await this.connection.list_all_files(this.id)).files;
      let ret = [];
      for (let i = 0; i < res.length; i++) {
        let f;
        if (res[i].mimeType === "application/vnd.google-apps.folder") {
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
      if (result.parents && result.parents.length > 0) {
        if (result.parents.length > 1) {
          this.parents = [];
          for (let i = 0; i < result.parents.length; i++) {
            let f = new Folder(result.parents[i], this.connection);
            this.parents.push(f);
            if (i == 0) {
              this.parent = f;
            }
          }
        } else {
          this.parent = new Folder(result.parents[0], this.connection);
        }
      } else {
        this.parent = null;
      }
      this.size = result.size;
      this.trashed = result.trashed;
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
