import AzureBlobIntegration from "../integrations/AzureBlob/azureBlobIntegration";

import Folder from "./folder";

export default interface Item {
  id: string;
  connection: AzureBlobIntegration;
  type: "file" | "folder";

  get_parent(): Promise<Folder>;
  get_name(): Promise<string>;
  delete(): Promise<void>;
  retrieve_info(): Promise<void>;
}
