module.exports = data => {
  return function(folderID) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await data.client.folders.delete(folderID));
      } catch (err) {
        reject(err);
      }
    });
  };
};
