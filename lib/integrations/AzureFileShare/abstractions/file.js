const Item = require("./item");

const fs = require("fs");
const tmp = require("tmp");
const path = require("path");
const md5File = require("md5-file");

class File extends Item {
  constructor(id, connection, parentFolder, fileName) {
    super(connection);

    this.type = "file";
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

  async download_to(localPath) {
    if (fs.existsSync(localPath)) {
      fs.rmSync(localPath);
    }

    await this.fileClient.downloadToFile(localPath);
  }

  /**
   * Not recommended to be heavily used for Azure, since this needs to download the file temporarily to get the checksum.
   */
  async get_checksum() {
    const tempDir = tmp.dirSync({
      unsafeCleanup: true,
    });

    let localFilePath = path.join(tempDir.name, await this.get_name());

    await this.download_to(localFilePath);

    const hash = md5File.sync(localFilePath);

    tempDir.removeCallback();

    return hash;
  }
}

module.exports = File;