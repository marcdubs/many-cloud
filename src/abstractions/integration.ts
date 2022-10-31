import Folder from "./folder";
import File from "./file";

export default interface Integration {
  type: IntegrationType;
  settings: { [key: string]: any };
  folder(id: string): Folder;
  file(id: string): File;
}

export enum IntegrationType {
  AzureBlob = "AzureBlob",
}
