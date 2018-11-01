const {
  BeforeAll,
  AfterAll,
  Given,
  When,
  Then,
  setDefaultTimeout
} = require("cucumber");

const assert = require("assert");

Given("I create a {string} integration", function(name) {
  this.integration = require("../../").integration(name);
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
