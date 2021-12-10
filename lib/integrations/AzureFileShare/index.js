const { URL } = require("url");
const path = require("path");
const fs = require("fs");
const { ShareServiceClient, StorageSharedKeyCredential } = require("@azure/storage-file-share");

class AzureFileShareIntegration {
  constructor(props) {
    this.type = "AzureFileShare";

    let account = null;
    let accountKey = null;
    let shareURL = null;

    if (!props.account || !props.accountKey || !props.shareURL) {
      if (fs.existsSync(path.join(__dirname, "../../../credentials/azure_file_share.json"))) {
        let load = require("../../../credentials/azure_file_share.json");
        account = load.account;
        accountKey = load.accountKey;
        shareURL = load.shareURL;
      }
    } else {
      account = props.account;
      accountKey = props.accountKey;
      shareURL = props.shareURL;
    }

    if (account && accountKey && shareURL) {
      shareURL = new URL(shareURL);
      let storageOrigin = shareURL.origin;
      let shareName = path.basename(shareURL.pathname);
      this.shareServiceClient = new ShareServiceClient(
        storageOrigin,
        new StorageSharedKeyCredential(account, accountKey)
      );
      this.shareClient = this.shareServiceClient.getShareClient(shareName);
    } else {
      throw new Error("No way to connect to Azure File Share provided. Need account + accountKey + shareURL.");
    }
  }

  /**
   * Cross-platform consistent joining of path with /
   */
  join_path(...list) {
    return path.join(...list).split(path.sep).join("/");
  }
}

module.exports = (props) => {
  return new Promise((resolve, reject) => {
    resolve(new AzureFileShareIntegration(props));
  });
}