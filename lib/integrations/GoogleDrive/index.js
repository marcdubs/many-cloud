const require_fields = require("../../utils/require_fields");
const fs = require("fs");

function add_on_tokens_event(data, callback) {
	data.oAuth2Client.on("tokens", tokens => {
		if (!data.credentials.tokens) data.credentials.tokens = new Object();

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
			function(err) {
				if (err) {
					throw new Error(
						"Error saving Google Drive Credentials file:\n" + err
					);
				} else {
					if (callback) callback();
				}
			}
		);
	});
}

module.exports = function(props, callback) {
	let data = {};

	const { google } = require("googleapis");
	data.credentials = require("../../../credentials/gdrive.json");
	const SCOPES = ["https://www.googleapis.com/auth/drive"];
	const {
		client_secret,
		client_id,
		redirect_uri
	} = data.credentials.installed;

	data.authenticate = function(props, callback) {
		if (!props) throw new Error("Argument is undefined.");

		if (props["authentication_token"]) {
			require_fields(props, ["redirect_uri"]);
			data.oAuth2Client = new google.auth.OAuth2(
				client_id,
				client_secret,
				props["redirect_uri"]
			);
			add_on_tokens_event(data, callback);
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
				add_on_tokens_event(data, callback);
				data.oAuth2Client.refreshAccessToken();
			} else {
				callback();
			}
		} else {
			throw new Error(
				'Argument must contain either "authentication_token" and "redirect_uri" ' +
					'or both "access_token" and "refresh_token".'
			);
		}
	};

	data.get_tokens = function() {
		return data.credentials.tokens;
	};

	data.setup_drive = function() {
		let auth = data.oAuth2Client;
		data.drive = google.drive({ version: "v3", auth });
	};

	data.list_files = function(pageSize, nextPageToken) {
		pageSize = pageSize || 10;
		return new Promise((resolve, reject) => {
			let params = {
				pageSize: pageSize,
				fields: "nextPageToken, files(id, name)"
			};

			if (nextPageToken) params.pageToken = nextPageToken;

			if (!data.drive) {
				data.setup_drive();
			}
			data.drive.files.list(params, (err, props) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(props.data);
			});
		});
	};

	data.list_all_files = function() {
		return new Promise((resolve, reject) => {
			let nextPageToken = null;
			let iteration = 0;
			let res = {};
			res.files = [];
			let nextPage = function() {
				if (nextPageToken != null || iteration == 0) {
					data.list_files(1000, nextPageToken)
						.then(function(value) {
							value.files.forEach(function(file, i) {
								res.files.push(file);
								if (i == value.files.length - 1) {
									nextPageToken = value.nextPageToken;
									iteration++;
									nextPage();
								}
							});
						})
						.catch(function(e) {
							reject(e);
						});
				} else {
					resolve(res);
				}
			};
			nextPage();
		});
	};

	data.authenticate(props, callback);
	return data;
};
