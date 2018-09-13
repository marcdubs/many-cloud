const { google } = require("googleapis");

module.exports = (props, callback) => {
  let data = {};

  data.credentials =
    props.credentials || require("../../../credentials/gdrive.json");

  data.authenticate = require("./functions/authenticate")(data);
  data.list_files = require("./functions/list_files")(data);
  data.list_all_files = require("./functions/list_all_files")(data);
  data.upload_file = require("./functions/upload_file")(data);
  data.delete_file = require("./functions/delete_file")(data);

  data.get_tokens = () => {
    return data.credentials.tokens;
  };

  data.setup_drive = () => {
    let auth = data.oAuth2Client;
    data.drive = google.drive({ version: "v3", auth });
  };

  data.authenticate(props, callback);
  return data;
};
