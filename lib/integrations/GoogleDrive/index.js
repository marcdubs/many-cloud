const require_fields = require('../../utils/require_fields');
const fs = require('fs');

function add_on_tokens_event(data, callback) {
	data.oAuth2Client.on('tokens', tokens => {
		if(!data.credentials.tokens)
			data.credentials.tokens = new Object();

		if(tokens["access_token"]) {
			data.credentials.tokens["access_token"] = tokens["access_token"];
			data.credentials.tokens["expiry_date"]  = tokens["expiry_date"];
		}

		if(tokens["refresh_token"])
			data.credentials.tokens["refresh_token"] = tokens["refresh_token"];

		if(tokens["token_type"])
			data.credentials.tokens["token_type"]   = tokens["token_type"];

        fs.writeFile('./credentials/gdrive.json', JSON.stringify(data.credentials), 'utf8', function(err) {
        	if(err) {
        		throw new Error('Error saving Google Drive Credentials file:\n' + err);
        	} else {
	        	if(callback)
	        		callback();
	        }
        });
    });
}

module.exports = function(props, callback) {
	let data = {};

	const {google} = require('googleapis');
	data.credentials = require('../../../credentials/gdrive.json');
	const SCOPES = ['https://www.googleapis.com/auth/drive'];
	const {client_secret, client_id, redirect_uri} = data.credentials.installed;

	data.authenticate = function(props, callback) {
		if(!props)
			throw new Error('Argument is undefined.');

		if(props["authentication_token"]) {
			require_fields(props, ["redirect_uri"]);
			data.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, props["redirect_uri"]);
			add_on_tokens_event(data, callback);
			data.oAuth2Client.getToken(props["authentication_token"]);
			
		} else if(props["access_token"] && props["refresh_token"]) {
			if(props["force_reset"] || !props["expiry_date"] || (new Date).getTime() > props["expiry_date"]) {
				data.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
				data.oAuth2Client.setCredentials(props);
				add_on_tokens_event(data, callback);
				data.oAuth2Client.refreshAccessToken();
			}
		} else {
			throw new Error('Argument must contain either "authentication_token" and "redirect_uri" ' +
						    'or both "access_token" and "refresh_token".');
		}
	}

	data.get_tokens = function() {
		return data.credentials.tokens;
	}

	data.authenticate(props, callback);
	return data;
};