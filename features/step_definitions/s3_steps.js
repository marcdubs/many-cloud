const {
  BeforeAll,
  AfterAll,
  Given,
  When,
  Then,
  setDefaultTimeout
} = require("cucumber");
const fs = require("fs");

let firstTimeGettingCredentials = true;

const _getS3Credentials = () => {
  if (process.env.IS_CI && firstTimeGettingCredentials) {
    firstTimeGettingCredentials = false;
    const creds = {
      accessKeyId: process.env.CI_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.CI_S3_SECRET_ACCESS_KEY,
      bucket: process.env.CI_S3_BUCKET
    };
    fs.writeFileSync("./credentials/s3.json", JSON.stringify(creds), "utf8");
  }
  return require("../../credentials/s3.json");
};

Given("I connect to the demo s3 account", async function() {
  let credentials = await _getS3Credentials();
  let props = JSON.parse(JSON.stringify(credentials));
  this.connection = await this.integration(props);
});
