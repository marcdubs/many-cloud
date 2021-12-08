const Item = require("./item");

class File extends Item {
  constructor(id, connection, parentFolder, fileName) {
    super(connection);

    this.type = "folder";
    this.id = id;

    if (parentFolder && fileName) {
      this.fileClient = parentFolder.directoryClient.getFileClient(fileName);
    } else {
      let splitPath = id.split("/");
      let currClient = connection.shareClient;

      for (let i = 0; i < splitPath.length; i++) {
        if (i === splitPath.length - 1) {
          currClient = currClient.getFileClient(splitPath[i]);
        } else {
          currClient = currClient.getDirectoryClient(splitPath[i]);
        }
      }
      this.fileClient = currClient;
    }

  }
}

module.exports = File;