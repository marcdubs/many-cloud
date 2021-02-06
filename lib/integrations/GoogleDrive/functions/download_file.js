const fs = require("fs");

module.exports = (data) => {
  return function(fileID, filePath) {
    return new Promise(async (resolve, reject) => {
      if (!data.drive) {
        data.setup_drive();
      }
      const dest = fs.createWriteStream(filePath);
      data.drive.files.get(
        { fileId: fileID, alt: "media" },
        { responseType: "stream" },
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }

          res.data.on("finish", () => {
            dest.destroy();
            resolve();
          });
          res.data.pipe(dest);
        }
      );
    });
  };
};
