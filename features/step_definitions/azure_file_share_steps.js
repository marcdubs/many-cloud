const {
  Given,
} = require("cucumber");
const fs = require("fs");

let firstTimeGettingCredentials = true;

const _getAzureFileShareCredentials = () => {
  if (process.env.IS_CI && firstTimeGettingCredentials) {
    firstTimeGettingCredentials = false;
    const creds = {
      account: process.env.CI_AZURE_FILE_SHARE_ACCOUNT,
      accountKey: process.env.CI_AZURE_FILE_SHARE_ACCOUNT_KEY,
      shareURL: process.env.CI_AZURE_FILE_SHARE_URL
    };
    fs.writeFileSync("./credentials/azure_file_share.json", JSON.stringify(creds), "utf8");
  }
  return require("../../credentials/azure_file_share.json");
};

Given("I connect to the demo azure file share account", async function () {
  let credentials = await _getAzureFileShareCredentials();
  let props = JSON.parse(JSON.stringify(credentials));
  this.connection = await this.integration(props);
});
