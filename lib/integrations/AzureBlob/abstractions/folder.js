const Item = require("./item");

const path = require("path");

class Folder extends Item {
  constructor(id, connection) {
    super(connection);

    this.type = "folder";
    this.id = id;
    this.containerClient = connection.containerClient;

    if (id.toLowerCase() === "root") {
      this.id = "/";
    };

    // Remove the last character if it's a slash
    if (this.id.charAt(this.id.length - 1) === "/") {
      this.id = this.id.substring(0, this.id.length - 1);
    }

    // Remove the first character if it is a slash
    if (this.id.charAt(0) === "/") {
      this.id = this.id.substring(1);
    }
  }

  async list_files() {
    const File = require("./file");

    let list = [];

    let prefix = this.id;

    // Append a slash
    if (prefix.charAt(prefix.length - 1) !== "/") {
      prefix += "/";
    }

    // Special case for root, just make prefix empty
    if (prefix === "/") {
      prefix = "";
    }

    // Get files in this folder
    for await (const item of this.containerClient.listBlobsByHierarchy("/", { prefix })) {
      if (item.kind === "prefix") {
        list.push(new Folder(item.name, this.connection));
      } else {
        list.push(new File(item.name, this.connection));
      }
    }

    return list;
  }

  async delete() {
    const files = await this.list_files();
    for (let i = 0; i < files.length; i++) {
      await files[i].delete();
    }
  }

  async upload_file(localPath) {
    const File = require("./file");
    const fileName = path.basename(localPath);
    const file = new File(this.connection.join_path(this.id, fileName), this.connection);
    await file.blockBlobClient.uploadFile(localPath);
    return file;
  }

  async new_folder(name) {
    return new Folder(this.connection.join_path(this.id, name), this.connection);
  }
}

module.exports = Folder;