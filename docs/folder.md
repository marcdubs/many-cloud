# Folder
- [Introduction](#introduction)
- [Constructors](#constructors)
  * [new Folder(id, connection)](#new-folderid-connection)
- [Methods](#methods)
  * [list_files()](#list_files)
  * [upload_file(path)](#upload_filepath)
  * [new_folder(name)](#new_foldername)
## Introduction
Folder is one of the three object classes that provides abstraction to what cloud drive you're dealing with. Providing similar functions for all of them.

File and Folder both import all of the functions inside of [item](item.md).

After you establish a connection to any integration as described in the [authentication](authentication.md) documentation, you can create a folder like so:
```js
const Folder = require("many-cloud/lib/abstractions/folder");

//Create a File object with an ID and a drive connection.
let folder = new Folder("some-file-id", connection);
let root_folder = new Folder("root", connection);
```

Along with all the functions of [item](item.md), folder also has these functions:

## Constructors

### new Folder(id, connection)

Parameters:
| Name | Type | Description |
| -- | -- | -- |
| id | String | A Folder ID. "root" for root folder. |
| connection | Object | A connection to an integration |

## Methods

### list_files()
List the files in this folder.

Parameters: None

Returns: Promise A promise that resolves with a list of files

### upload_file(path)
Upload a local file to this folder.

Parameters:
| Name | Type | Description |
| -- | -- | -- |
| path | String | Path to local file to upload |

Returns: Promise that returns a file object when resolved

### new_folder(name)
Creates a new folder inside of this folder.

Parameters:
| Name | Type | Description |
| -- | -- | -- |
| name| String | Name of folder to create |

Returns: Promise that resolves with a Folder object.
