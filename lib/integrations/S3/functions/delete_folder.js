module.exports = data => {
  recursive_delete = folderID => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await data.list_all_files(folderID);

        //Delete any files in this folder
        for (let i = 0; i < res.Contents.length; i++) {
          await data.delete_file(res.Contents[i].Key);
        }

        //Recursively delete and folders in this folder
        for (let i = 0; i < res.CommonPrefixes.length; i++) {
          await recursive_delete(
            res.CommonPrefixes[i].Prefix.substring(
              0,
              res.CommonPrefixes[i].Prefix.length - 1
            )
          );
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };

  return function(folderID) {
    return new Promise(async (resolve, reject) => {
      try {
        await recursive_delete(folderID);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  };
};
