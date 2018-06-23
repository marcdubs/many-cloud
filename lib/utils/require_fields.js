module.exports = function(obj, fields) {
	if (!obj) throw new Error("No object argument.");

	if (!fields) throw new Error("No fields argument.");

	for (let i = 0; i < fields.length; i++)
		if (!obj[fields[i]])
			throw new Error('Missing argument: "' + fields[i] + '".');
};
