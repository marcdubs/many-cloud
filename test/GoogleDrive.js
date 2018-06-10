require('./test');

const assert = require('assert');
describe('GoogleDrive', function() {
	const app = require('../');

	const integration = app.integration('GoogleDrive');
	it("GoogleDrive integration should exist", function() {
		assert(integration);
	});

	var credentials;
	var conection;
	var original_access_token;
	describe("credentials", function() {
		it("gdrive.json should exist inside of the credentials directory", function() {
			credentials = require('../credentials/gdrive.json');
		});

		it("installed->client_id should exist in credentials file", function() {
			assert(credentials["installed"]["client_id"]);
		});

		it('should have access and refresh tokens from "npm run auth_gdrive"', function() {
			assert(credentials["tokens"]);
			assert(credentials["tokens"]["access_token"]);
			assert(credentials["tokens"]["refresh_token"]);
			original_access_token = credentials["tokens"]["access_token"];
		});

		it("connection should instantiate successfully", function(done) {
			let props = credentials.tokens;
			props["force_reset"] = true;
			connection = integration(props, function() {
				done();
			});
		});

		it("Access token should not be the same since we forced a reset", function() {
			assert.notEqual(original_access_token,connection.get_tokens()["access_token"]);
		});
	});
});