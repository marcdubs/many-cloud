# Many-Cloud
 
  [![Build Status](https://travis-ci.org/marcdubs/many-cloud.svg?branch=master)](https://travis-ci.org/marcdubs/many-cloud)
  [![Coverage Status](https://coveralls.io/repos/github/marcdubs/many-cloud/badge.svg?branch=master)](https://coveralls.io/github/marcdubs/many-cloud?branch=master)
  [![npm version](https://badge.fury.io/js/many-cloud.svg)](https://badge.fury.io/js/many-cloud)

Many Cloud is an open source utility that creates an interface for many cloud platforms found online that, after authentication, abstracts out which cloud service you are manipulating for the sake of simplicity. Many Cloud keeps things simple by automatically refreshing OAuth2 tokens and by providing an object-oriented approach to dealing with Files and Folders.

## Documentation
- [Authentication](docs/authentication.md)
- [File Abstraction](docs/file.md)
- [Folder Abstraction](docs/folder.md)
- [Item Abstraction](docs/item.md)

Steps to use:
Firstly, you need to authenticate with whatever cloud services you will be using. For more information, see the [authentication](docs/authentication.md) docs. Here is an example for authenticating with Google Drive:
```js
//Initial authentication
let connection  = require("many-cloud").integration("GoogleDrive")({
	authentication_token:  authentication_token,
	redirect_uri:  redirect_uri
});

//Future authentication
let connection = require("many-cloud").integration("GoogleDrive")({
	access_token:  access_token,
	expiry_date:  expiry_date,
	refresh_token:  refresh_token,
	token_type:  "Bearer",
	force_reset:  true //Optionally forces a refresh of the access token
});
```

Authenticate the users with whatever integration you are using and then you will have access to the [file](docs/file.md)/[folder](docs/folder.md) Abstractions. Here's an example:
```js
//Require the folder abstraction
const Folder = require("many-cloud").abstraction("Folder");

//Get the root folder of our connection (to any of the supported drives)
let root_folder = new Folder("root", connection);

//List the files in the root folder
//This will return an array of File and Folder abstractions
let file_list = await root_folder.list_files();
//Download all of the files in the root folder (but not the folders)
for(let i = 0; i < file_list.length; i++) {
	if(file_list[i].type === 'file') {
		let name = await file_list[i].get_name();
		await file_list[i].download_to('some/local/storage/' + name);
	}
}
```

## Supported Cloud Services
| Platform | Supported |
|--|--|
| ![Google Drive](docs/gdrive.png) | ![Yes](docs/check.png) | 
| ![Box](docs/box.png) | ![Yes](docs/check.png) | 
| ![S3](docs/s3.png) | ![Yes](docs/check.png) |
| ![Dropbox](docs/dropbox.png) | ![To do](docs/x.png) |
| More to come! | |
