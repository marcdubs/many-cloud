const Item = require("./item");

const fs = require("fs");
const tmp = require("tmp");
const path = require("path");
const md5File = require("md5-file");

class File extends Item {
  constructor(id, connection) {
    super(connection);

    this.type = "file";
    this.id = id;

    // Remove the first character if it is a slash
    if (this.id.charAt(0) === "/") {
      this.id = this.id.substring(1);
    }

    this.blockBlobClient = connection.containerClient.getBlockBlobClient(this.id);
  }

  async download_to(localPath) {
    if (fs.existsSync(localPath)) {
      fs.rmSync(localPath);
    }

    await this.blockBlobClient.downloadToFile(localPath);
  }

  async delete() {
    await this.blockBlobClient.delete();
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