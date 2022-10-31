import { URL } from "url";
import path from "path";
import fs from "fs";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  ContainerClient,
} from "@azure/storage-blob";

import { DefaultCloudStorageParameters } from "../../defaults";

import Integration, { IntegrationType } from "../../abstractions/integration";

import File from "../../abstractions/file";
import Folder from "../../abstractions/folder";

import AzureBlobFile from "./azureBlobFile";
import AzureBlobFolder from "./azureBlobFolder";

export default interface AzureBlobIntegrationParameters
  extends DefaultCloudStorageParameters {
  account?: string;
  accountKey?: string;
  containerURL?: string;
}

export default class AzureBlobIntegration implements Integration {
  type = IntegrationType.AzureBlob;
  settings: { [key: string]: any };
  blobServiceClient: BlobServiceClient;
  containerClient: ContainerClient;

  constructor(props: AzureBlobIntegrationParameters) {
    this.settings = props.settings || {};

    let account: string | null = null;
    let accountKey: string | null = null;
    let containerURLString: string | null = null;

    if (!props.account || !props.accountKey || !props.containerURL) {
      if (
        fs.existsSync(
          path.join(__dirname, "../../../credentials/azure_blob.json")
        )
      ) {
        let load = require("../../../credentials/azure_blob.json");
        account = load.account;
        accountKey = load.accountKey;
        containerURLString = load.containerURL;
      }
    } else {
      account = props.account;
      accountKey = props.accountKey;
      containerURLString = props.containerURL;
    }

    if (account && accountKey && containerURLString) {
      const containerURL = new URL(containerURLString);
      let storageOrigin = containerURL.origin;
      let containerName = path.basename(containerURL.pathname);
      this.blobServiceClient = new BlobServiceClient(
        storageOrigin,
        new StorageSharedKeyCredential(account, accountKey)
      );
      this.containerClient = this.blobServiceClient.getContainerClient(
        containerName
      );
    } else {
      throw new Error(
        "No way to connect to Azure Blob Container provided. Need account + accountKey + containerURL."
      );
    }
  }

  folder(id: string): Folder {
    return new AzureBlobFolder(id, this);
  }

  file(id: string): File {
    return new AzureBlobFile(id, this);
  }

  /**
   * Cross-platform consistent joining of path with /
   */
  join_path(...list: string[]) {
    return path
      .join(...list)
      .split(path.sep)
      .join("/");
  }
}
