const S3 = require("aws-sdk").S3;

module.exports = props => {
  let data = {};

  data.type = "S3";

  if (!props.accessKeyId || !props.secretAccessKey) {
    let load = require("../../../credentials/s3.json");
    data.accessKeyId = load.accessKeyId;
    data.secretAccessKey = load.secretAccessKey;
  } else {
    data.accessKeyId = props.accessKeyId;
    data.secretAccessKey = props.secretAccessKey;
  }

  data.s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: data.accessKeyId,
    secretAccessKey: data.secretAccessKey
  });

  data.bucket = props.bucket;

  data.upload_file = require("./functions/upload_file")(data);
  data.delete_file = require("./functions/delete_file")(data);
  data.delete_folder = require("./functions/delete_folder")(data);
  data.download_file = require("./functions/download_file")(data);

  data.list_files = require("./functions/list_files")(data);
  data.list_all_files = require("./functions/list_all_files")(data);
  data.get_file_info = require("./functions/get_file_info")(data);

  return new Promise((resolve, reject) => {
    resolve(data);
  });
};
