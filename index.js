const integration_list = require('./lib/integrations/list.json');
var integrations = [];
for(let i = 0; i < integration_list.length; i++)
	integrations[integration_list[i]] = require('./lib/integrations/' + integration_list[i]);

function integration(name) {
	if(!name)
		throw new Error("Missing name argument.");

	if(!integration_list.includes(name))
		throw new Error('Integration "' + name + '" not found.');
	
	return integrations[name];
}

module.exports = {integration_list, integration};