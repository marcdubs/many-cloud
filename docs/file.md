# File

- [Introduction](#introduction)
- [Constructors](#constructors)
  * [new File(id, connection)](#new-fileid-connection)
- [Methods](#methods)
  * [download_to(path)](#download_topath)
  * [get_checksum()](#get_checksum)

## Introduction

File is one of the three object classes that provides abstraction to what cloud drive you're dealing with. Providing similar functions for all of them.

File and Folder both import all of the functions inside of [item](item.md).

After you establish a connection to any integration as described in the [authentication](authentication.md) documentation, you can create a file like so:
```js
const File = require("many-cloud/lib/abstractions/file");

//Create a File object with an ID and a drive connection.
let file = new File("some-file-id", connection);
```

Along with all the functions of [item](item.md), file also has these functions:

## Constructors

### new File(id, connection)

Parameters:
| Name | Type | Description |
|--|--|--|
| id | String | A file ID |
| connection | Object | A connection to an integration |

## Methods

### download_to(path)

Parameters:
| Name | Type | Description |
| -- | -- | -- |
| path | String | Path to destination |

Returns: Promise that resolves once file is downloaded

### get_checksum()

Parameters: None

Returns: Promise that resolves with a checksum (sha1 or md5, etc depending on what the cloud service decided on).
