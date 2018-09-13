module.exports = data => {
  return function(pageSize, nextPageToken) {
    pageSize = pageSize || 10;
    return new Promise((resolve, reject) => {
      let params = {
        pageSize: pageSize,
        fields: "nextPageToken, files(id, name)"
      };

      if (nextPageToken) params.pageToken = nextPageToken;

      if (!data.drive) {
        data.setup_drive();
      }
      data.drive.files.list(params, (err, props) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(props.data);
      });
    });
  };
};
