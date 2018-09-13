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

  data.get_tokens = () => {
    return data.credentials.tokens;
  };

  data.authenticate(props, callback);

  return data;
};
