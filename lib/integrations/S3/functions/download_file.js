const fs = require("fs");

module.exports = data => {
  return function(fileID, dest) {
    return new Promise(async (resolve, reject) => {
      let params = {
        Key: fileID,
        Bucket: data.bucket
      };
      data.s3.getObject(params, (err, body) => {
        if (err) {
          reject(err);
        } else {
          fs.writeFile(dest, body.data, err2 => {
            if (err2) {
              reject(err2);
              return;
            }
            resolve();
          });
        }
      });
    });
  };
};
