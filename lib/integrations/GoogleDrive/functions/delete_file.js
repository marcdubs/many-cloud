module.exports = data => {
  return function(file_id) {
    return new Promise((resolve, reject) => {
      if (!file_id) {
        reject(new Error("Expected file id parameter"));
      }

      if (!data.drive) {
        data.setup_drive();
      }

      data.drive.files.delete({ fileId: file_id }, err => {
        if (err) {
          reject(err);
        } else {
          resolve("done!");
        }
      });
    });
  };
};
