const {
  BeforeAll,
  AfterAll,
  Given,
  When,
  Then,
  setDefaultTimeout
} = require("cucumber");
const deep_equal = require("deep-equal");
const assert = require("assert");

let firstTimeGettingCredentials = true;
const fs = require("fs");

const _getGDriveCredentials = () => {
  if (process.env.IS_CI && firstTimeGettingCredentials) {
    firstTimeGettingCredentials = false;
    const creds = {
      installed: {
        client_id: process.env.CI_GDRIVE_CLIENT_ID,
        client_secret: process.env.CI_GDRIVE_CLIENT_SECRET,
        project_id: process.env.CI_GDRIVE_PROJECT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://accounts.google.com/o/oauth2/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        redirect_uris: [process.env.CI_GDRIVE_REDIRECT_URI]
      },
      tokens: {
        access_token: "toget",
        expiry_date: 1,
        refresh_token: process.env.CI_GDRIVE_REFRESH_TOKEN,
        token_type: "Bearer",
        force_reset: true
      }
    };
    fs.writeFileSync(
      "./credentials/gdrive.json",
      JSON.stringify(creds),
      "utf8"
    );
  }
  return require("../../credentials/gdrive.json");
};

BeforeAll(function() {
  _getGDriveCredentials();
});

Given("I connect to the demo google account", async function() {
  let credentials = await _getGDriveCredentials();
  let props = JSON.parse(JSON.stringify(credentials.tokens));
  props.credentials = credentials;
  this.connection = await this.integration(props);
});
