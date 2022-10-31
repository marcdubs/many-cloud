import path from "path";

import AzureBlobItem from "./azureBlobItem";
import AzureBlobFile from "./azureBlobFile";
import AzureBlobIntegration from "./azureBlobIntegration";

import Item from "../../abstractions/item";
import Folder from "../../abstractions/folder";

export default class AzureBlobFolder extends AzureBlobItem implements Folder {
  type: "folder" = "folder";

  constructor(id: string, connection: AzureBlobIntegration) {
    super(id, connection, "folder");
  }

  async list_files(): Promise<Item[]> {
    const containerClient = this.connection.containerClient;
    let list: AzureBlobItem[] = [];

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
    for await (const item of containerClient.listBlobsByHierarchy("/", {
      prefix,
    })) {
      if (item.kind === "prefix") {
        list.push(new AzureBlobFolder(item.name, this.connection));
      } else {
        list.push(new AzureBlobFile(item.name, this.connection));
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

  async upload_file(localPath: string): Promise<AzureBlobFile> {
    const fileName = path.basename(localPath);
    const file = new AzureBlobFile(
      this.connection.join_path(this.id, fileName),
      this.connection
    );
    await file.blockBlobClient.uploadFile(localPath);
    return file;
  }

  async new_folder(name: string): Promise<AzureBlobFolder> {
    return new AzureBlobFolder(
      this.connection.join_path(this.id, name),
      this.connection
    );
  }
}
