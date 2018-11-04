/**
 * Item object that has functions that both File and Folder have
 * @constructor
 */
function Item() {}

/**
 * Retrieves info for this item and adds that info to the object.
 *
 * @return {Promise}
 */
Item.prototype.retrieve_info = function() {
  const Folder = require("./folder");
  return new Promise(async (resolve, reject) => {
    try {
      let result;
      if (this.type === "folder") {
        result = await this.connection.get_folder_info(this.id);
      } else {
        result = await this.connection.get_file_info(this.id);
      }
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
 * Get the name of this item.
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
 * Get the parent folder of this item or null if there isn't one.
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
