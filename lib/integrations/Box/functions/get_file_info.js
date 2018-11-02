module.exports = data => {
  return function(fileID, fields) {
    return new Promise(async (resolve, reject) => {
      try {
        res = await data.client.files.get(fileID, { fields: fields });
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  };
};
