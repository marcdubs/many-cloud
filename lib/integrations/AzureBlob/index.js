const { URL } = require("url");
const path = require("path");
const fs = require("fs");
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

class AzureBlobIntegration {
  constructor(props) {
    this.type = "AzureBlob";
    this.settings = props.settings || {};

    if (!("autoMkdirOnFileUpload" in this.settings)) {
      this.settings.autoMkdirOnFileUpload = true;
    }

    let account = null;
    let accountKey = null;
    let containerURL = null;

    if (!props.account || !props.accountKey || !props.containerURL) {
      if (fs.existsSync(path.join(__dirname, "../../../credentials/azure_blob.json"))) {
        let load = require("../../../credentials/azure_blob.json");
        account = load.account;
        accountKey = load.accountKey;
        containerURL = load.containerURL;
      }
    } else {
      account = props.account;
      accountKey = props.accountKey;
      containerURL = props.containerURL;
    }

    if (account && accountKey && containerURL) {
      containerURL = new URL(containerURL);
      let storageOrigin = containerURL.origin;
      let containerName = path.basename(containerURL.pathname);
      this.blobServiceClient = new BlobServiceClient(
        storageOrigin,
        new StorageSharedKeyCredential(account, accountKey)
      );
      this.containerClient = this.blobServiceClient.getContainerClient(containerName);
    } else {
      throw new Error("No way to connect to Azure Blob Container provided. Need account + accountKey + containerURL.");
    }
  }
}

module.exports = (props) => {
  return new Promise((resolve, reject) => {
    resolve(new AzureBlobIntegration(props));
  });
}