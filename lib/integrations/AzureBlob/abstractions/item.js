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
      return "Root";
    } else {
      return name;
    }
  }

  /**
   * Doesn't do anything for Azure Blob.
   */
  async retrieve_info() { }
}

module.exports = Item;