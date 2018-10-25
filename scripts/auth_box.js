/*
Script to take client_id and client_secret from credentials/box.json and 
fill in the access and refresh tokens.
*/
const express = require("express");
const opn = require("opn");
const credentials = require("../credentials/box.json");
const { client_id } = credentials.installed;

//Create Express server on free port for callback
const app = express();
const port = 2033;

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
  opn(
    "https://account.box.com/api/oauth2/authorize?response_type=code" +
      "&client_id=" +
      client_id +
      "&redirect_uri=http://localhost:2033&"
  );
}

function retrieve_tokens(authentication_token, port) {
  let integration = require("../").integration("Box")(
    {
      authentication_token: authentication_token
    },
    function() {
      console.log("Saved tokens to credentials JSON");
      process.exit();
    }
  );
}
