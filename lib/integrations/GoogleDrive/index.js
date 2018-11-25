const { google } = require("googleapis");

module.exports = props => {
  let data = {};

  data.type = "GoogleDrive";

  data.credentials =
    props.credentials || require("../../../credentials/gdrive.json");

  //Copy the credentials to be sure
  data.credentials = JSON.parse(JSON.stringify(data.credentials));

  props.save_credentials_to_file;
  if (props.save_credentials_to_file == undefined) {
    props.save_credentials_to_file = process.env.SAVE_ALL_CREDENTIALS_TO_FILE;
  }

  data.authenticate = require("./functions/authenticate")(data);
  data.list_files = require("./functions/list_files")(data);
  data.list_all_files = require("./functions/list_all_files")(data);
  data.upload_file = require("./functions/upload_file")(data);
  data.delete_file = require("./functions/delete_file")(data);
  data.download_file = require("./functions/download_file")(data);
  data.get_file_info = require("./functions/get_file_info")(data);

  data.new_folder = require("./functions/new_folder")(data);
  data.delete_folder = data.delete_file;
  data.get_folder_info = data.get_file_info;

  data.get_tokens = () => {
    return data.credentials.tokens;
  };

  data.setup_drive = () => {
    let auth = data.oAuth2Client;
    data.drive = google.drive({ version: "v3", auth });
  };

  return new Promise(async (resolve, reject) => {
    await data.authenticate(props);
    resolve(data);
  });
};
