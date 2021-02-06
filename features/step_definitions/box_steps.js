const {
  BeforeAll,
  AfterAll,
  Given,
  When,
  Then,
  setDefaultTimeout,
} = require("cucumber");
const deep_equal = require("deep-equal");
const assert = require("assert");

let firstTimeGettingCredentials = true;
const fs = require("fs");

setDefaultTimeout(30000);

const mongoose = require("mongoose");

const _get_ref_token = async function() {
  mongoose.Promise = require("bluebird");
  await mongoose.connect(process.env.CREDS_MONGODB_URI);

  const creds_schema = mongoose.Schema({
    name: String,
    token: String,
  });

  const creds = mongoose.model("creds", creds_schema);

  const token = (await creds.findOne({ name: "Box" })).token;

  await mongoose.connection.close();

  return token;
};

const _set_ref_token = async function(token) {
  mongoose.Promise = require("bluebird");
  await mongoose.connect(process.env.CREDS_MONGODB_URI);

  const creds_schema = mongoose.Schema({
    name: String,
    token: String,
  });

  const creds = mongoose.model("creds", creds_schema);

  const cred = await creds.findOne({ name: "Box" });

  cred.token = token;
  await cred.save();

  await mongoose.connection.close();
};

const _getBoxCredentials = async function() {
  if (process.env.IS_CI && firstTimeGettingCredentials) {
    let ref = await _get_ref_token();

    firstTimeGettingCredentials = false;
    const creds = {
      installed: {
        client_id: process.env.CI_BOX_CLIENT_ID,
        client_secret: process.env.CI_BOX_CLIENT_SECRET,
      },
      tokens: {
        access_token: "toget",
        refresh_token: ref,
      },
    };
    fs.writeFileSync("./credentials/box.json", JSON.stringify(creds), "utf8");
  }

  let file = fs.readFileSync("./credentials/box.json", "utf8");
  if (!file) {
    return undefined;
  }
  return JSON.parse(file);
};

BeforeAll(async function() {
  await _getBoxCredentials();
});

AfterAll(async function() {
  if (process.env.IS_CI) {
    let creds = await _getBoxCredentials();
    await _set_ref_token(creds.tokens.refresh_token);
  }
});

Given("I connect to the demo box account", async function() {
  let credentials = await _getBoxCredentials();
  let props = JSON.parse(JSON.stringify(credentials.tokens));
  props.credentials = credentials;
  this.connection = await this.integration(props);
});

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
