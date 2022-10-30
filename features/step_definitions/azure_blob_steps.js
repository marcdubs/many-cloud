const {
  Given,
} = require("cucumber");
const fs = require("fs");

let firstTimeGettingCredentials = true;

const _getAzureBlobCredentials = () => {
  if (process.env.IS_CI && firstTimeGettingCredentials) {
    firstTimeGettingCredentials = false;
    const creds = {
      account: process.env.CI_AZURE_BLOB_ACCOUNT,
      accountKey: process.env.CI_AZURE_BLOB_ACCOUNT_KEY,
      shareURL: process.env.CI_AZURE_BLOB_CONTAINER_URL
    };
    fs.writeFileSync("./credentials/azure_blob.json", JSON.stringify(creds), "utf8");
  }
  return require("../../credentials/azure_blob.json");
};

Given("I connect to the demo azure blob account", async function () {
  let credentials = await _getAzureBlobCredentials();
  let props = JSON.parse(JSON.stringify(credentials));
  this.connection = await this.integration(props);
});
