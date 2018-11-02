module.exports = data => {
    return function(folderID, fields) {
      return new Promise(async (resolve, reject) => {
        try {
          res = await data.client.folders.get(folderID, { fields: fields });
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    };
  };
  