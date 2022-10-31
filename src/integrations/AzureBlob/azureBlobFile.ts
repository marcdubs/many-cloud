import fs from "fs";
import tmp from "tmp";
import path from "path";
import md5File from "md5-file";

import { BlockBlobClient } from "@azure/storage-blob";

import AzureBlobItem from "./azureBlobItem";
import AzureBlobIntegration from "./azureBlobIntegration";

import File from "../../abstractions/file";

export default class AzureBlobFile extends AzureBlobItem implements File {
  type: "file" = "file";
  blockBlobClient: BlockBlobClient;

  constructor(id: string, connection: AzureBlobIntegration) {
    super(id, connection, "file");

    this.blockBlobClient = connection.containerClient.getBlockBlobClient(
      this.id
    );
  }

  async download_to(localPath: string) {
    if (fs.existsSync(localPath)) {
      await fs.promises.unlink(localPath);
    }

    await this.blockBlobClient.downloadToFile(localPath);
  }

  async delete() {
    await this.blockBlobClient.delete();
  }

  /**
   * Not recommended to be heavily used for Azure, since this needs to download the file temporarily to get the checksum.
   */
  async get_checksum(): Promise<string> {
    const tempDir = tmp.dirSync({
      unsafeCleanup: true,
    });

    let localFilePath = path.join(tempDir.name, await this.get_name());

    await this.download_to(localFilePath);

    const hash = await md5File(localFilePath);

    tempDir.removeCallback();

    return hash;
  }
}
