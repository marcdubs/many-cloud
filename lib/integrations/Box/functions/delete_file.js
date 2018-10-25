module.exports = data => {
  return function(fileID) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await data.client.files.delete(fileID);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  };
};
