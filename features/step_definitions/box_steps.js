const { Before, Given, When, Then } = require("cucumber");
const deep_equal = require("deep-equal");
const assert = require("assert");

let firstTimeGettingCredentials = true;
const fs = require("fs");

const _getBoxCredentials = function() {
  if (process.env.IS_CI && firstTimeGettingCredentials) {
    firstTimeGettingCredentials = false;
    const creds = {
      installed: {
        client_id: process.env.CI_BOX_CLIENT_ID,
        client_secret: process.env.CI_BOX_CLIENT_SECRET
      },
      tokens: {
        access_token: "toget",
        refresh_token: process.env.CI_BOX_REFRESH_TOKEN
      }
    };
    fs.writeFileSync("./credentials/box.json", JSON.stringify(creds), "utf8");
  }
  return require("../../credentials/box.json");
};

Given("I create a {string} integration", function(name) {
  this.integration = require("../../").integration(name);
});

Given("I connect to the demo box account", async function() {
  let credentials = _getBoxCredentials();
  let props = JSON.parse(JSON.stringify(credentials.tokens));
  props.credentials = credentials;
  this.connection = await this.integration(props);
});

When(
  "I call the function {string} on the integration with parameters: {string}",
  async function(func, params) {
    this.function_result = await this.connection[func].apply(
      this,
      params.split(",")
    );
  }
);

Then("the entries must contain only the following:", function(dataTable) {
  assert.equal(
    deep_equal(dataTable.hashes(), this.function_result.entries),
    true
  );
});

Then("print the result", function() {
  console.log(this.function_result);
});
