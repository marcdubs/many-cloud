import AzureBlobIntegration from "./azureBlobIntegration";
import path from "path";
import AzureBlobFolder from "./azureBlobFolder";

import Item from "../../abstractions/item";
import Folder from "../../abstractions/folder";

export default abstract class AzureBlobItem implements Item {
  id: string;
  type: "file" | "folder";
  connection: AzureBlobIntegration;

  constructor(
    id: string,
    connection: AzureBlobIntegration,
    type: "file" | "folder"
  ) {
    this.connection = connection;
    this.id = id;
    this.type = type;

    if (id.toLowerCase() === "root") {
      this.id = "/";
    }

    // Remove the first character if it is a slash
    if (this.id.charAt(0) === "/") {
      this.id = this.id.substring(1);
    }

    // Remove the last character if it's a slash
    if (this.id.charAt(this.id.length - 1) === "/") {
      this.id = this.id.substring(0, this.id.length - 1);
    }
  }

  async get_parent(): Promise<Folder> {
    return new AzureBlobFolder(path.dirname(this.id), this.connection);
  }

  async get_name(): Promise<string> {
    let name = path.basename(this.id);

    if (name === "/" || name === "") {
      return "Root";
    } else {
      return name;
    }
  }

  abstract delete(): Promise<void>;

  async retrieve_info(): Promise<void> {}
}
