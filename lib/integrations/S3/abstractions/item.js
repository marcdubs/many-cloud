/**
 * Item object that has functions that both File and Folder have
 * @constructor
 */
function Item() {}

/**
 * Retrieves info for this file or folder and adds that info to the object.
 *
 * @return {Promise}
 */
Item.prototype.retrieve_info = function() {
  const Folder = require("./folder");
  return new Promise(async (resolve, reject) => {
    let indexOfName = this.id.lastIndexOf("/");
    if (indexOfName == -1) {
      if (this.name === "Root") {
        this.parent = null;
      } else {
        this.parent = new Folder("root", this.connection);
      }
    } else {
      let parent_id = this.id.substring(0, indexOfName);
      this.parent = new Folder(parent_id, this.connection);
    }

    if (this.type === "file") {
      try {
        let res = await this.connection.get_file_info(this.id);
        this.checksum = res.ETag;
        this.trashed = false;
      } catch (err) {
        if (err.code === "NotFound") {
          this.trashed = true;
        } else {
          reject(err);
        }
      }
    } else {
      this.trashed = false; //Folders aren't really ever "trashed" in S3 since they simply build up the file keys.
    }
    resolve();
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
 * Get the name of this file or folder.
 *
 * @return {Promise}
 */
Item.prototype.get_name = function() {
  return new Promise(async (resolve, reject) => {
    //For S3, the name field is filled in with the File and Folder constructors
    resolve(this.name);
  });
};

/**
 * Get the parent folder of this file or folder or null if there isn't one.
 *
 * @return {Promise} Promise that resoles with the Folder object.
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
