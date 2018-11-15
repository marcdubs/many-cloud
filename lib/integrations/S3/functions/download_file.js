const fs = require("fs");

module.exports = data => {
  return function(fileID, dest) {
    return new Promise(async (resolve, reject) => {
      let params = {
        Key: fileID,
        Bucket: data.bucket
      };
      try {
        var output = fs.createWriteStream(dest);
        await data.s3
          .getObject(params)
          .createReadStream()
          .pipe(output);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };
};
