module.exports = data => {
  return function(folderID, pageSize, offset) {
    offset = offset || 0;
    pageSize = pageSize || 10;
    return new Promise((resolve, reject) => {
      data.client.folders
        .getItems(folderID, {
          fields: "name",
          offset: offset,
          limit: pageSize
        })
        .then(items => {
          resolve(items);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
};
