Array.prototype.isArray = true;

module.exports = function(obj, fields) {
  if (!obj) {
    throw new Error("No object argument.");
  }

  if (!fields) {
    throw new Error("No fields argument.");
  }

  if (!fields.isArray) {
    throw new Error("fields argument isn't an array");
  }

  for (let i = 0; i < fields.length; i++) {
    if (!obj[fields[i]]) {
      throw new Error('Missing argument: "' + fields[i] + '".');
    }
  }
};
