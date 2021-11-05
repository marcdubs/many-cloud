/**
 * Represents an abstract item. Do not construct this itself, please use either file or folder.
 */
class Item {
  /**
  * Retrieves info for this file or folder and adds that info to the object.
  * The only times you need to call this directly is if:
  * 1. You want to cache the file's info at a certain point.
  * 2. You need to replace the cache that exists for this file.
  *
  * @return {Promise}
  */
  async retrieve_info() {
    return await this.internal.retrieve_info();
  }

  /**
   *
   * @return {Folder} The folder containing this item.
   */
  async get_parent() {
    let folder_internal = this.internal.get_parent();

    const Folder = require("./folder");

    return new Folder(folder_internal.id, folder_internal.connection, folder_internal);
  }

  /**
   * Get the name of this file or folder.
   *
   * @return {Promise}
   */
  async get_name() {
    return await this.internal.get_name();
  }

  /**
   * Delete this item.
   *
   * @return {Promise} Resolves with undefined if operation was successfull.
   */
  async delete() {
    return await this.internal.delete();
  }

  /**
   * The ID for this file for whatever cloud it is in.
   *
   * @return {String}
   */
  get id() {
    return this.internal.id;
  }

  /**
   * @return {Object} the Many-Cloud connection object for the cloud storage this file is a part of.
   */
  get connection() {
    return this.internal.connection;
  }

  /**
   * @return {String} The type of cloud item this represents. Either "file" or "folder"
   */
  get type() {
    return this.internal.type;
  }
}

module.exports = Item;