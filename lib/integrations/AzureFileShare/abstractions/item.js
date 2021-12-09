const path = require("path");

/**
 * Item object that has functions that both File and Folder have
 * @constructor
 */
class Item {
  constructor(connection) {
    this.connection = connection;
  }

  async get_parent() {
    const Folder = require("./folder");
    return new Folder(path.dirname(this.id), this.connection);
  }

  async get_name() {
    let name = path.basename(this.id);

    if (name === "/" || name === '') {
      return "root";
    } else {
      return name;
    }
  }

  async delete() {
    let client = this.type === "file" ? this.fileClient : this.directoryClient;
    await client.delete();
  }

  /**
   * Doesn't do anything for Azure File Share.
   */
  async retrieve_info() { }
}

module.exports = Item;