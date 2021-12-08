
/**
 * Item object that has functions that both File and Folder have
 * @constructor
 */
class Item {
  constructor(connection) {
    this.connection = connection;
  }
}

module.exports = Item;