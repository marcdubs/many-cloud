/**
 * Item object that has functions that both File and Folder have
 * @constructor
 */
function Item() {}

/**
 * Retrieves info for this folder and adds that info to the object.
 *
 * @return {Promise}
 */
Item.prototype.retrieve_info = function() {
  const Folder = require("./folder");
  return new Promise(async (resolve, reject) => {
    try {
      let result = null;
      if (this.type === "folder") {
        result = await this.connection.get_folder_info(this.id);
      } else {
        result = await this.connection.get_file_info(this.id);
      }
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
      this.checksum = result.md5Checksum;
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Delete this item.
 *
 * @return {Promise} Resolves with undefined if operation was successfull.
 */
Item.prototype.delete = function() {
  return new Promise(async (resolve, reject) => {
    try {
      if (this.type === "folder") {
        await this.connection.delete_folder(this.id);
      } else {
        await this.connection.delete_file(this.id);
      }
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
Item.prototype.get_name = function() {
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
Item.prototype.get_parent = function() {
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

module.exports = Item;
