# Authentication
Authentication with whatever cloud service(s) you are using is required for any other functionality of many-cloud. The only problem is, we can't abstract out this part of the process as every cloud service has a slightly different way of authenticating. So this document is split up into sections for all supported cloud services.

- [Google Drive](#google-drive)
  * [Initial Authentication](#initial-authentication)
  * [Future Authentication](#future-authentication)
  * [Example](#example)
- [Box](#box)
  * [Initial Authentication](#initial-authentication-1)
  * [Future Authentication](#future-authentication-1)
  * [Example](#example-1)
- [S3](#s3)
  * [All Authentication](#all-authentication)

## Google Drive

### Initial Authentication

Once you have a Client Secret, Client ID, and a redirect URI setup on [Google's API console](https://console.cloud.google.com/apis/) with the scope:
```
https://www.googleapis.com/auth/drive
```
I'd recommend using the [googleapis](https://www.npmjs.com/package/googleapis) NPM module to generate the URI like so:
```js
const { google } =  require("googleapis");
const oAuth2Client =  new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

const authUrl = oAuth2Client.generateAuthUrl({
	access_type: "offline",
	scope: ["https://www.googleapis.com/auth/drive"]
});
```
And now the authUrl variable is the URI that you should have your users' open to authenticate. And whatever your **REDIRECT_URI** is will receive a response with an [authentication token](https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/).

With that authentication token, you can retrieve an [access](https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/) and [refresh token](https://www.oauth.com/oauth2-servers/access-tokens/refreshing-access-tokens/) like so:
```js
let connection = await require("many-cloud").integration("GoogleDrive")({
	authentication_token:  AUTHENTICATION_TOKEN,
	redirect_uri: REDIRECT_URI
});
```
After that, the **connection.credentials.tokens** object will look like this:
```js
{
	"access_token": ACCESS_TOKEN,
	"refresh_token": REFRESH_TOKEN,
	"expiry_date": EXPIRY_DATE,
	"token_type": TOKEN_TYPE
}
```
You'll want to save all of these values somewhere **AFTER** you are done with any of the cloud operations you were going to do. That way, if a refresh has to occur at any time, you save the newest tokens and not the older ones.

### Future Authentication
Once you're done with the initial authentication, you'll have the access_token, refresh_token, expiry_date, and token_type saved somewhere. To authenticate a connection at this point you would do this:
```js
let connection = await require("many-cloud").integration("GoogleDrive")({
	access_token: ACCESS_TOKEN,
	refresh_token: REFRESH_TOKEN,
	expiry_date: EXPIRY_DATE,
	token_type: TOKEN_TYPE,
	force_reset: FORCE_RESET //If true, will force the access_token to refresh
});
```
But make sure that just like the initial authentication, you save these with what's stored at **connection.credentials.tokens** **AFTER** you do all of the operations you need to do.

### Example
See [scripts/auth_gdrive.js](../scripts/auth_gdrive.js) for an example of initial authentication.

## Box

### Initial Authentication
Once you have a Client Secret, Client ID, and your redirect_uri setup on [Box's developer console](https://developer.box.com/), have your users visit the URI: 
```
https://account.box.com/api/oauth2/authorize?response_type=code&client_id=CLIENT_ID&redirect_uri=REDIRECT_URI
```
At wherever that REDIRECT_URI points to, you'll receive a response with an [authentication token](https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/)

With that authentication token, you can retrieve an [access](https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/) and [refresh token](https://www.oauth.com/oauth2-servers/access-tokens/refreshing-access-tokens/) like so:
```js
let connection = await require("many-cloud").integration("Box")({
	authentication_token:  AUTHENTICATION_TOKEN
});
```

After that, the **connection.credentials.tokens** object will look like this:
```js
{
"access_token": ACCESS_TOKEN,
"refresh_token": REFRESH_TOKEN,
"acquired_at_MS" : ACQUIRED_AT_MS,
"access_token_TTLMS" : ACCESS_TOKEN_TTLMS
}
```
You'll want to save all of these values somewhere **AFTER** you are done with any of the cloud operations you were going to do. That way, if a refresh has to occur at any time, you save the newest tokens and not the older ones.
### Future Authentication
Once you're done with the initial authentication, you'll have the access_token, refresh_token, acquired_at_MS, and access_token_TTLMS saved somewhere. To authenticate a connection at this point you would do this:
```js
let connection = await require("many-cloud").integration("Box")({
	access_token: ACCESS_TOKEN,
	refresh_token: REFRESH_TOKEN,
	access_token_TTLMS: ACCESS_TOKEN_TTLMS,
	acquired_at_MS: ACQUIRED_AT_MS
	force_reset: FORCE_RESET //If true, will force the access_token to refresh
});
```
But make sure that just like the initial authentication, you save these with what's stored at **connection.credentials.tokens** **AFTER** you do all of the operations you need to do.

### Example
See [scripts/auth_box.js](../scripts/auth_box.js) for an example of initial authentication.


## S3

### All Authentication
After you get your **accessKeyId** and **secretAccessKey** ([info on that here](https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/)), and a [bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html) setup, the code to connect to a bucket is the same every single time:
```js
let connection = await require("many-cloud").integration("S3")({
	accessKeyId: ACCESS_KEY_ID
	secretAccessKey: SECRET_ACCESS_KEY,
	bucket: NAME_OF_BUCKET
});
```
There is no need to re-store your access keys every time as they never change unless you change them in your account settings.
