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
      try {
        stats = await stat(file_path);
        if (stats.isDirectory()) {
          reject(
            new Error("Path represents a directory. Please use upload_folder.")
          );
          return;
        }

        let file = await data.client.files.uploadFile(
          folderID,
          file_name,
          fs.createReadStream(file_path)
        );
        resolve(file);
      } catch (error) {
        reject(error);
        return;
      }
    });
  };
};
