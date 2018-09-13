module.exports = data => {
  return function() {
    return new Promise((resolve, reject) => {
      let nextPageToken = null;
      let iteration = 0;
      let res = {};
      res.files = [];
      let nextPage = () => {
        if (nextPageToken != null || iteration == 0) {
          data
            .list_files(1000, nextPageToken)
            .then(value => {
              value.files.forEach((file, i) => {
                res.files.push(file);
                if (i == value.files.length - 1) {
                  nextPageToken = value.nextPageToken;
                  iteration++;
                  nextPage();
                }
              });
            })
            .catch(e => {
              reject(e);
            });
        } else {
          resolve(res);
        }
      };
      nextPage();
    });
  };
};
