const pageSize = 100;

module.exports = (data, list_files_func) => {
  return function(folderID) {
    return new Promise(async (resolve, reject) => {
      let items = {
        entries: [],
        total_count: 0
      };
      let new_items;
      let offset = 0;
      do {
        try {
          new_items = await list_files_func(folderID, pageSize, offset);
        } catch (error) {
          reject(error);
          return;
        }
        offset += pageSize;
        items.entries = items.entries.concat(new_items.entries);
        items.total_count += new_items.total_count;
      } while (new_items.total_count != 0);
      resolve(items);
    });
  };
};
