module.exports = data => {
  return function(fileID) {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: data.bucket,
        Key: fileID
      };
      data.s3.headObject(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  };
};
