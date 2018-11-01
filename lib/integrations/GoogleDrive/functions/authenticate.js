const fs = require("fs");
const require_fields = require("../../../utils/require_fields");
const { google } = require("googleapis");

function add_on_tokens_event(data, callback) {
  data.oAuth2Client.on("tokens", tokens => {
    data.credentials.tokens = data.credentials.tokens || {};

    if (tokens["access_token"]) {
      data.credentials.tokens["access_token"] = tokens["access_token"];
      data.credentials.tokens["expiry_date"] = tokens["expiry_date"];
    }

    if (tokens["refresh_token"])
      data.credentials.tokens["refresh_token"] = tokens["refresh_token"];

    if (tokens["token_type"])
      data.credentials.tokens["token_type"] = tokens["token_type"];

    fs.writeFile(
      "./credentials/gdrive.json",
      JSON.stringify(data.credentials),
      "utf8",
      err => {
        if (err) {
          throw new Error(
            "Error saving Google Drive Credentials file:\n" + err
          );
        } else {
          callback();
        }
      }
    );
  });
}

module.exports = data => {
  const { client_secret, client_id, redirect_uri } = data.credentials.installed;

  return function(props) {
    return new Promise(async (resolve, reject) => {
      if (!props) {
        reject(new Error("Argument is undefined."));
        return;
      }

      resolve_callback = function() {
        resolve();
      };

      if (props["authentication_token"]) {
        require_fields(props, ["redirect_uri"]);
        data.oAuth2Client = new google.auth.OAuth2(
          client_id,
          client_secret,
          props["redirect_uri"]
        );
        add_on_tokens_event(data, resolve_callback);
        data.oAuth2Client.getToken(props["authentication_token"]);
      } else if (props["access_token"] && props["refresh_token"]) {
        data.oAuth2Client = new google.auth.OAuth2(
          client_id,
          client_secret,
          redirect_uri
        );
        data.oAuth2Client.setCredentials(props);
        if (
          props["force_reset"] ||
          !props["expiry_date"] ||
          new Date().getTime() > props["expiry_date"]
        ) {
          add_on_tokens_event(data, resolve_callback);
          data.oAuth2Client.refreshAccessToken();
        } else {
          resolve();
        }
      } else {
        reject(
          new Error(
            'Argument must contain either "authentication_token" and "redirect_uri" ' +
              'or both "access_token" and "refresh_token".'
          )
        );
        return;
      }
    });
  };
};
