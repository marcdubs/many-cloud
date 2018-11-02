const fs = require("fs");

module.exports = data => {
  return function(fileID, dest) {
    return new Promise(async (resolve, reject) => {
      data.client.files.getReadStream(fileID, null, function(err, stream) {
        if (err) {
          reject(err);
          return;
        }
        var output = fs.createWriteStream(dest);
        stream.pipe(output);
        resolve();
      });
    });
  };
};
