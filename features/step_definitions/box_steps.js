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
const fetch = require("node-fetch");

setDefaultTimeout(30000);

const _getBoxCredentials = async function() {
  if (process.env.IS_CI && firstTimeGettingCredentials) {
    let ref_ = await fetch(process.env.CI_CREDS_URI + "get_ref_token", {
      method: "POST",
      body: JSON.stringify({
        t: process.env.CREDS_REQ_TOKEN
      }),
      headers: { "Content-Type": "application/json" }
    });
    let ref = await ref_.json();

    firstTimeGettingCredentials = false;
    const creds = {
      installed: {
        client_id: process.env.CI_BOX_CLIENT_ID,
        client_secret: process.env.CI_BOX_CLIENT_SECRET
      },
      tokens: {
        access_token: "toget",
        refresh_token: ref
      }
    };
    fs.writeFileSync("./credentials/box.json", JSON.stringify(creds), "utf8");
  }
  return require("../../credentials/box.json");
};

BeforeAll(async function() {
  await _getBoxCredentials();
});

AfterAll(async function() {
  if (process.env.IS_CI) {
    let creds = await _getBoxCredentials();
    await fetch(process.env.CI_CREDS_URI + "set_ref_token", {
      method: "POST",
      body: JSON.stringify({
        t: process.env.CREDS_REQ_TOKEN,
        new_token: creds.tokens.refresh_token
      }),
      headers: { "Content-Type": "application/json" }
    });
  }
});

Given("I create a {string} integration", function(name) {
  this.integration = require("../../").integration(name);
});

Given("I connect to the demo box account", async function() {
  let credentials = await _getBoxCredentials();
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

When(
  "I call the function {string} on the integration with parameters saved as world key: {string}",
  async function(func, world_key) {
    this.function_result = await this.connection[func].apply(
      this,
      this[world_key].split(",")
    );
  }
);

Then("the entries must contain only the following:", function(dataTable) {
  assert.equal(
    deep_equal(dataTable.hashes(), this.function_result.entries),
    true
  );
});

Then("index {int} of entries field: {string} should equal: {string}", function(
  index,
  key,
  expected
) {
  assert.equal(this.function_result.entries[index][key], expected);
});

Then("save index {int} of entires field: {string} as {string}", function(
  index,
  key,
  world_key
) {
  this[world_key] = this.function_result.entries[index][key];
});

Then("delete the file identified by the world key: {string}", async function(
  world_key
) {
  await this.connection["delete_file"](this[world_key]);
});

Then("the result is undefined", function() {
  assert.equal(this.function_result, undefined);
});

Then("print the result", function() {
  console.log(this.function_result);
});
