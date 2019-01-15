const integration_list = require("./lib/integrations/list.json");
var integrations = [];
for (let i = 0; i < integration_list.length; i++)
  integrations[integration_list[i]] = require("./lib/integrations/" +
    integration_list[i]);

function integration(name) {
  if (!name) throw new Error("Missing name argument.");

  if (!integration_list.includes(name))
    throw new Error('Integration "' + name + '" not found.');

  return integrations[name];
}

function abstraction(name) {
  if (!name) throw new Error("Missing abstraction argument");

  name = name.toLowerCase();

  if (name === "folder") {
    return require("./lib/abstractions/folder");
  }

  if (name === "file") {
    return require("./lib/abstractions/file");
  }

  throw new Error('Abstraction "' + name + '" not found.');
}

module.exports = { integration_list, integration, abstraction };
