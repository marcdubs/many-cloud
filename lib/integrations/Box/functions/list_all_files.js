const pageSize = 100;

module.exports = (data, list_files_func) => {
  return function(folderID) {
    return new Promise(async (resolve, reject) => {
      let items = [];
      let new_items = [];
      let offset = 0;
      do {
        try {
          new_items = await list_files_func(folderID, pageSize, offset);
        } catch (error) {
          reject(error);
          return;
        }
        offset += pageSize;
        items = items.concat(new_items);
      } while (new_items.length > 0);
      resolve(items);
    });
  };
};
