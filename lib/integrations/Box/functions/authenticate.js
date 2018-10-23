const fs = require("fs");

function _writeCredentials(credentials, callback) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      "./credentials/box.json",
      JSON.stringify(credentials),
      "utf8",
      err => {
        if (err) {
          throw new Error("Error saving Box Credentials file:\n" + err);
        } else {
          resolve();
        }
      }
    );
  });
}

module.exports = data => {
  const { sdk } = data;

  let tokenStore = {};

  tokenStore.read = function(callback) {
    callback(null, {
      accessToken: data.credentials.tokens.access_token,
      refreshToken: data.credentials.tokens.refresh_token,
      acquiredAtMS: data.credentials.tokens.acquired_at_MS,
      accessTokenTTLMS: data.credentials.tokens.access_token_TTLMS
    });
  };

  tokenStore.write = async function(tokenInfo, callback) {
    data.credentials.tokens = data.credentials.tokens || {};
    data.credentials.tokens.access_token = tokenInfo.accessToken;
    data.credentials.tokens.refresh_token = tokenInfo.refreshToken;
    data.credentials.tokens.acquired_at_MS = tokenInfo.acquiredAtMS;
    data.credentials.tokens.access_token_TTLMS = tokenInfo.accessTokenTTLMS;
    await _writeCredentials(data.credentials);
    callback(null, tokenInfo);
  };

  tokenStore.clear = function(callback) {
    console.log("Tokenstore clear was called. Currently unsupported");
    callback(null, null);
  };

  return function(props, callback) {
    return new Promise(async (resolve, reject) => {
      if (!props) throw new Error("Argument is undefined.");

      if (props["authentication_token"]) {
        sdk.getTokensAuthorizationCodeGrant(
          props["authentication_token"],
          null,
          async function(err, tokens) {
            if (err) {
              throw err;
            }

            data.credentials.tokens = data.credentials.tokens || {};
            data.credentials.tokens.access_token = tokens.accessToken;
            data.credentials.tokens.refresh_token = tokens.refreshToken;
            data.credentials.tokens.access_token_TTLMS =
              tokens.accessTokenTTLMS;
            data.credentials.tokens.acquired_at_MS = tokens.acquiredAtMS;

            await _writeCredentials(data.credentials);
            resolve();
          }
        );
      } else if (props["access_token"] && props["refresh_token"]) {
        let tokenInfo = {
          accessToken: props.access_token,
          refreshToken: props.refresh_token,
          acquiredAtMS: props.acquired_at_MS,
          accessTokenTTLMS: props.access_token_TTLMS
        };

        if (
          props["force_reset"] ||
          !props["access_token_TTLMS"] ||
          !props["acquired_at_MS"]
        ) {
          sdk.getTokensRefreshGrant(tokenInfo.refreshToken, function(
            err,
            tokenInfo
          ) {
            if (err) {
              throw err;
            }
            tokenStore.write(tokenInfo, function() {
              data.client = sdk.getPersistentClient(tokenInfo, tokenStore);
              resolve();
            });
          });
        } else {
          data.client = sdk.getPersistentClient(tokenInfo, tokenStore);
          resolve();
        }
      } else {
        throw new Error("Unsupported properties");
      }
    });
  };
};
