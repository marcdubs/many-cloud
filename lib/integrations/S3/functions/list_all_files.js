module.exports = data => {
  function list_section(params, next_marker) {
    return new Promise(async (resolve, reject) => {
      if (next_marker) {
        params.Marker = next_marker;
      }

      data.s3.listObjects(params, async (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          if (res.IsTruncated) {
            let res_rec = await list_section(params, res.NextMarker);
            for (let i = 0; i < res_rec.Contents.length; i++) {
              res.Contents.push(res_rec.Contents[i]);
            }
            for (let i = 0; i < res_rec.CommonPrefixes.length; i++) {
              res.CommonPrefixes.push(res_rec.CommonPrefixes[i]);
            }
          }
          res.IsTruncated = false;
          delete res.NextMarker;
          delete res.Marker;
          resolve(res);
        } catch (err2) {
          reject(err2);
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
      try {
        let res = await list_section(params, null);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  };
};
