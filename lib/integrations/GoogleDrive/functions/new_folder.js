module.exports = data => {
  return function(parentID, name) {
    let meta = {
      name: name,
      mimeType: "application/vnd.google-apps.folder"
    };
    if (parentID) {
      meta.parents = [parentID];
    }
    return new Promise((resolve, reject) => {
      if (!data.drive) {
        data.setup_drive();
      }
      data.drive.files.create(
        {
          resource: meta,
          fields: "id"
        },
        function(err, props) {
          if (err) {
            reject(err);
            return;
          }
          resolve(props.data);
        }
      );
    });
  };
};
