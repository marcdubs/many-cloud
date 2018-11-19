const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const stat = promisify(fs.stat);

module.exports = data => {
  return function(folderID, file_path) {
    return new Promise(async (resolve, reject) => {
      if (!file_path) {
        reject(new Error("Missing file path parameter."));
        return;
      }

      let file_name = path.basename(file_path);

      let stats;
      stats = await stat(file_path);
      if (stats.isDirectory()) {
        reject(new Error("Path represents a directory."));
        return;
      }

      let key = file_name;

      if (folderID) {
        key = folderID + "/" + file_name;
      }

      let params = {
        Bucket: data.bucket,
        Key: key,
        Body: fs.createReadStream(file_path)
      };

      data.s3.upload(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
};
