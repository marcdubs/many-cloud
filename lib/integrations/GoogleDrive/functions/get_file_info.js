module.exports = data => {
  return function(fileID, params) {
    params =
      params ||
      "kind, id, name, mimeType, description, trashed, explicitlyTrashed, parents, modifiedTime, fullFileExtension, md5Checksum, size";

    return new Promise((resolve, reject) => {
      if (!data.drive) {
        data.setup_drive();
      }
      data.drive.files.get({ fileId: fileID, fields: params }, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res.data);
      });
    });
  };
};
