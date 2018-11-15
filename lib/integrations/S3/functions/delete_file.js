module.exports = data => {
  return function(fileID) {
    return new Promise(async (resolve, reject) => {
      let params = {
        Bucket: data.bucket,
        Key: fileID
      };
      data.s3.deleteObject(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
};
