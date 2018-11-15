module.exports = data => {
  return function(folderID) {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: data.bucket,
        MaxKeys: 1000000,
        Delimiter: "/"
      };

      if (folderID) {
        params.Prefix = folderID + "/";
      }

      data.s3.listObjects(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  };
};
