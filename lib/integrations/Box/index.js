const Box = require("box-node-sdk");

module.exports = (props, callback) => {
  let data = {};

  props.save_credentials_to_file;
  if (props.save_credentials_to_file == undefined) {
    props.save_credentials_to_file = process.env.SAVE_ALL_CREDENTIALS_TO_FILE;
  }

  data.type = "Box";

  data.credentials =
    props.credentials || require("../../../credentials/box.json");

  data.sdk = new Box({
    clientID: data.credentials["installed"]["client_id"],
    clientSecret: data.credentials["installed"]["client_secret"]
  });

  data.authenticate = require("./functions/authenticate")(data);

  data.list_files = require("./functions/list_files")(data);
  data.list_all_files = require("./functions/list_all_files")(
    data,
    data.list_files
  );
  data.get_file_info = require("./functions/get_file_info")(data);
  data.upload_file = require("./functions/upload_file")(data);
  data.download_file = require("./functions/download_file")(data);
  data.delete_file = require("./functions/delete_file")(data);

  data.new_folder = require("./functions/new_folder")(data);
  data.delete_folder = require("./functions/delete_folder")(data);
  data.get_folder_info = require("./functions/get_folder_info")(data);

  data.get_tokens = () => {
    return data.credentials.tokens;
  };

  return new Promise(async (resolve, reject) => {
    await data.authenticate(props, callback);
    resolve(data);
  });
};
