require('./test');

const assert = require('assert');
const promiseMe = require('mocha-promise-me');

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

		it("connection should instantiate successfully (expected runtime > 500ms)", function(done) {
			let props = credentials.tokens;
			props["force_reset"] = true;
			this.timeout(15000);
			connection = integration(props, function() {
				done();
			});
		});

		it("Access token should not be the same since we forced a reset", function() {
			assert.notEqual(original_access_token,connection.get_tokens()["access_token"]);
			original_access_token = connection.get_tokens()["access_token"];
		});

		it("Access token should be the same the second time we instantiate a connection", function(done) {
			let props = credentials.tokens;
			props["force_reset"] = false;
			this.timeout(15000);
			connection = integration(props, function() {
				assert.strictEqual(original_access_token,connection.get_tokens()["access_token"]);
				done();
			});
		});
	});

	describe('functions', function() {

		//Establish a fresh credentials and conection object before each test
		beforeEach(function(done) {
			credentials = require('../credentials/gdrive.json');
			let props = credentials.tokens;
			this.timeout(15000);
			connection = integration(props, function() {
				done();
			});
		});


		it('list files should work successfully', function(done) {
			let assertion = (result) => {
			    assert.ok(result);
			    assert.ok(result.files);
			    if(result.files.length > 0 && result.nextPageToken) {
				}
			   	done();
			};

			promiseMe.thatYouResolve(connection.list_files(), assertion);
		});

		it('If there is a nextpageToken, it works and gives us different files', function(done) {
			let firstFileID = null;
			let nextPageToken = null;

			let secondPageAssertion = (result) => {
				assert.ok(result);
				assert.notEqual(firstFileID, result.files[0].id);
				done();
			};

			let assertion = (result) => {
			    assert.ok(result);
			    assert.ok(result.files);
			    if(result.files.length > 0 && result.nextPageToken) {
			    	firstFileID = result.files[0].id;
			    	nextPageToken = result.nextPageToken;
			    	promiseMe.thatYouResolve(connection.list_files(10, nextPageToken), secondPageAssertion);
				} else {
			   		done();
			   	}
			};

			promiseMe.thatYouResolve(connection.list_files(), assertion);
		});
	});
});