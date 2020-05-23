/*
Script to take client_id and client_secret from credentials/gdrive.json and 
fill in the access and refresh tokens.
*/
const express = require("express");
const get_port = require("get-port");
const opn = require("opn");
const { google } = require("googleapis");
const credentials = require("../credentials/gdrive.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const { client_secret, client_id } = credentials.installed;

//Create Express server on free port for callback
const app = express();
var port = 8080;
var server;
var received = false;
app.get("*", function(req, res, next) {
  if (!received) {
    let authentication_token = req.query.code;
    console.log("Received authentication token.");
    res.send("Received authentication token. You may now close this window.");
    server.close();
    retrieve_tokens(authentication_token, port);
    received = true;
  } else {
    res.send("Error: already received token.");
  }
});

server = app.listen(port, function() {
  get_oauth2(port);
});

function get_oauth2(port) {
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    "http://localhost:" + port
  );
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  opn(authUrl);
}

function retrieve_tokens(authentication_token, port) {
  let integration = require("../").integration("GoogleDrive")(
    {
      authentication_token: authentication_token,
      redirect_uri: "http://localhost:" + port,
    },
    function() {
      console.log("Saved tokens to credentials JSON");
      process.exit();
    }
  );
}
