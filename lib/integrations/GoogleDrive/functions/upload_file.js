const fs = require("fs");
const path = require("path");
const mime = require("mime");

module.exports = data => {
  return function(file_path) {
    return new Promise((resolve, reject) => {
      if (!file_path) {
        reject(new Error("Missing file path parameter."));
        return;
      }

      let stats = fs.stat(file_path, (err, stats) => {
        if (err) {
          reject(err);
          return;
        }

        if (stats.isDirectory()) {
          reject(
            new Error("Path represents a directory. Please use upload_folder.")
          );
          return;
        }

        if (!data.drive) {
          data.setup_drive();
        }

        let file_meta = {
          name: path.basename(file_path)
        };

        let media = {
          body: fs.createReadStream(file_path),
          mimeType: mime.getType(file_path)
        };

        data.drive.files.create(
          {
            resource: file_meta,
            media: media
          },
          (err, res) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(res.data);
            return;
          }
        );
      });
    });
  };
};
