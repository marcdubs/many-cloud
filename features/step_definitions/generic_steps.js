const {
  BeforeAll,
  AfterAll,
  Given,
  When,
  Then,
  setDefaultTimeout
} = require("cucumber");

const fs = require("fs");

const assert = require("assert");

const Folder = require("../../").abstraction("Folder");
const File = require("../../").abstraction("File");

paramaterize = function (string) {
  if (string === "null") {
    string = null;
  } else if (string === "undefined") {
    string = undefined;
  } else if (!isNaN(string)) {
    string = parseInt(string);
  }
  return string;
};

Given("I create a {string} integration", function (name) {
  this.integration = require("../../").integration(name);
});

Given("I get a folder with id: {string} and save it as: {string}", function (
  folderID,
  world_key
) {
  this[world_key] = new Folder(folderID, this.connection);
});

Given("I get a file with id: {string} and save it as: {string}", function (
  fileID,
  world_key
) {
  this[world_key] = new File(fileID, this.connection);
});

When("I call the function {string} on the integration", async function (func) {
  this.function_result = await this.connection[func].apply(this);
});

When(
  "I call the function {string} on the integration with parameters: {string}",
  async function (func, params_) {
    let params = params_.split(",");
    for (let i = 0; i < params.length; i++) {
      params[i] = paramaterize(params[i]);
    }

    this.function_result = await this.connection[func].apply(this, params);
  }
);

When(
  "I call the function {string} on the integration with parameters saved as world key: {string}",
  async function (func, world_key) {
    this.function_result = await this.connection[func].apply(
      this,
      this[world_key].split(",")
    );
  }
);

When("I call the function: {string} on saved object: {string}", async function (
  func,
  world_key
) {
  this.function_result = await this[world_key][func]();
});

When(
  "I call the function: {string} on saved object: {string} with parameters: {string}",
  async function (func, world_key, params_) {
    let params = params_.split(",");
    for (let i = 0; i < params.length; i++) {
      params[i] = paramaterize(params[i]);
    }
    this.function_result = await this[world_key][func].apply(
      this[world_key],
      params
    );
  }
);

Then("the length of {string} must be {int}", function (string, int) {
  assert.equal(this.function_result[string].length, int);
});

Then("delete the file identified by the world key: {string}", async function (
  world_key
) {
  if (this.connection["delete_file"]) {
    await this.connection["delete_file"](this[world_key]);
  } else {
    let file = new File(this[world_key], this.connection);
    await file.delete();
  }
});

Then("delete the file identified by: {string}", async function (id) {
  if (this.connection["delete_file"]) {
    await this.connection["delete_file"](id);
  } else {
    let file = new File(id, this.connection);
    await file.delete();
  }
});

Then("delete the folder identified by: {string}", async function (
  id
) {
  if (this.connection["delete_folder"]) {
    await this.connection["delete_folder"](id);
  } else {
    let folder = new Folder(id, this.connection);
    await folder.delete();
  }
});

Then("delete the folder identified by the world key: {string}", async function (
  world_key
) {
  if (this.connection["delete_folder"]) {
    await this.connection["delete_folder"](this[world_key]);
  } else {
    let folder = new Folder(this[world_key], this.connection);
    await folder.delete();
  }
});

Then("the result field: {string} should be: {string}", function (
  source,
  expected
) {
  assert.equal(this.function_result[source], paramaterize(expected));
});

Then("the result is undefined", function () {
  assert.equal(this.function_result, undefined);
});

Then("I save the result as: {string}", function (world_key) {
  this[world_key] = this.function_result;
});

Then("the result is null", function () {
  assert.equal(this.function_result, null);
});

Then("the result should equal: {string}", function (string) {
  assert.equal(this.function_result, string);
});

Then("the local file {string} exists", function (path) {
  assert(fs.existsSync(path));
});

Then("delete the local file {string}", function (path) {
  fs.unlinkSync(path);
});

Then("the length of the result must be: {int}", function (length) {
  assert.equal(this.function_result.length, length);
});

Then("print the result", function () {
  console.log(this.function_result);
});
