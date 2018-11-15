module.exports = data => {
  function list_section(params, next_marker) {
    return new Promise(async (resolve, reject) => {
      if (next_marker) {
        params.Marker = next_marker;
      }

      data.s3.listObjects(params, async (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          if (data.IsTruncated) {
            let res = await list_section(params, data.NextMarker);
            for (let i = 0; i < res.Contents.length; i++) {
              data.Contents.push(res.Contents[i]);
            }
          }
          data.IsTruncated = false;
          delete data.NextMarker;
          delete data.Marker;
          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  return function(folderID) {
    return new Promise(async (resolve, reject) => {
      let params = {
        Bucket: data.bucket,
        Delimiter: "/"
      };

      if (folderID) {
        params.Prefix = folderID + "/";
      }

      let res = await list_section(params, null);
      resolve(res);
    });
  };
};
