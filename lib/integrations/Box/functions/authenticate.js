const fs = require("fs");

function _writeCredentials(credentials, callback) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      "./credentials/box.json",
      JSON.stringify(credentials),
      "utf8",
      err => {
        if (err) {
          reject(new Error("Error saving Box Credentials file:\n" + err));
        } else {
          resolve();
        }
      }
    );
  });
}

module.exports = data => {
  const { sdk } = data;

  return function(props) {
    let tokenStore = {};

    tokenStore.read = function(callback) {
      callback(null, {
        accessToken: data.credentials.tokens.access_token,
        refreshToken: data.credentials.tokens.refresh_token,
        acquiredAtMS: data.credentials.tokens.acquired_at_MS,
        accessTokenTTLMS: data.credentials.tokens.access_token_TTLMS
      });
    };

    tokenStore.write = function(tokenInfo) {
      return new Promise(async (resolve, reject) => {
        data.credentials.tokens = data.credentials.tokens || {};
        data.credentials.tokens.access_token = tokenInfo.accessToken;
        data.credentials.tokens.refresh_token = tokenInfo.refreshToken;
        data.credentials.tokens.acquired_at_MS = tokenInfo.acquiredAtMS;
        data.credentials.tokens.access_token_TTLMS = tokenInfo.accessTokenTTLMS;
        try {
          if (props.save_credentials_to_file)
            await _writeCredentials(data.credentials);
          resolve(null, tokenInfo);
        } catch (error) {
          reject(error);
        }
      });
    };

    tokenStore.clear = function(callback) {
      console.log("Tokenstore clear was called. Currently unsupported");
      callback(null, null);
    };

    return new Promise(async (resolve, reject) => {
      if (!props) {
        reject(new Error("Argument is undefined."));
        return;
      }

      if (props["authentication_token"]) {
        sdk.getTokensAuthorizationCodeGrant(
          props["authentication_token"],
          null,
          async function(err, tokens) {
            if (err) {
              reject(err);
              return;
            }

            data.credentials.tokens = data.credentials.tokens || {};
            data.credentials.tokens.access_token = tokens.accessToken;
            data.credentials.tokens.refresh_token = tokens.refreshToken;
            data.credentials.tokens.access_token_TTLMS =
              tokens.accessTokenTTLMS;
            data.credentials.tokens.acquired_at_MS = tokens.acquiredAtMS;

            if (props.save_credentials_to_file)
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
          (!props["access_token_TTLMS"] || !props["acquired_at_MS"]) ||
          props["access_token_TTLMS"] + props["acquired_at_MS"] > Date.now()
        ) {
          sdk.getTokensRefreshGrant(tokenInfo.refreshToken, async function(
            err,
            tokenInfo
          ) {
            if (err) {
              reject(err);
              return;
            }
            try {
              await tokenStore.write(tokenInfo);
              data.client = sdk.getPersistentClient(tokenInfo, tokenStore);
              resolve();
            } catch (error) {
              reject(error);
              return;
            }
          });
        } else {
          data.client = sdk.getPersistentClient(tokenInfo, tokenStore);
          resolve();
        }
      } else {
        reject(new Error("Unsupported properties"));
        return;
      }
    });
  };
};
