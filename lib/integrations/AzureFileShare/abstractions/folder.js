const Item = require("./item");

class Folder extends Item {
  constructor(id, connection, parentFolder, folderName) {
    super(connection);

    this.type = "folder";

    if (parentFolder && folderName) {
      this.directoryClient = parentFolder.directoryClient.getDirectoryClient(folderName);
      this.id = id;
    } else if (id === "root" || id === "/") {
      this.directoryClient = connection.shareClient.rootDirectoryClient;
      this.id = "/";
    } else {
      this.id = id;
      let splitPath = id.split("/");
      let currClient = connection.shareClient;

      for (let i = 0; i < splitPath.length; i++) {
        currClient = currClient.getDirectoryClient(splitPath[i]);
      }
      this.directoryClient = currClient;
    }
  }

  async list_files() {
    const File = require("./file");

    let list = [];

    for await (const entity of this.directoryClient.listFilesAndDirectories()) {
      if (entity.kind === "directory") {
        list.push(new Folder(this.connection.join_path(this.id, '/', entity.value.name), this.connection, this, entity.value.name));
      } else {
        list.push(new File(this.connection.join_path(this.id, '/', entity.value.name), this.connection, this, entity.value.name))
      }
    }

    return list;
  }
}

module.exports = Folder;