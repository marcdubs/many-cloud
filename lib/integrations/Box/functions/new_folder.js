module.exports = data => {
  return function(parentID, name) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await data.client.folders.create(parentID, name));
      } catch (err) {
        reject(err);
      }
    });
  };
};
