const Box = require("box-node-sdk");

module.exports = (props, callback) => {
  let data = {};

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
  data.upload_file = require("./functions/upload_file")(data);
  data.delete_file = require("./functions/delete_file")(data);

  data.get_tokens = () => {
    return data.credentials.tokens;
  };

  return new Promise(async (resolve, reject) => {
    await data.authenticate(props, callback);
    resolve(data);
  });
};
