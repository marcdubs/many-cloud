const Item = require("./item");

const path = require("path");
class Folder extends Item {
  constructor(id, connection, parentFolder, folderName) {
    super(connection);

    this.type = "folder";

    if (parentFolder && folderName) {
      this.directoryClient = parentFolder.directoryClient.getDirectoryClient(folderName);
      this.id = id;
    } else if (id.toLowerCase() === "root" || id === "/") {
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
        list.push(new Folder(this.connection.join_path(this.id, entity.name), this.connection, this, entity.name));
      } else {
        list.push(new File(this.connection.join_path(this.id, entity.name), this.connection, this, entity.name))
      }
    }

    return list;
  }

  async upload_file(localPath) {
    const File = require("./file");

    const fileName = path.basename(localPath);

    const fileClient = this.directoryClient.getFileClient(fileName);
    await fileClient.uploadFile(localPath);

    return new File(this.connection.join_path(this.id, fileName), this.connection, this, fileName);
  }

  async new_folder(name) {
    await this.directoryClient.getDirectoryClient(name).createIfNotExists();

    return new Folder(this.connection.join_path(this.id, name), this.connection, this, name);
  }
}

module.exports = Folder;