# Item

Item is one of the three object classes that provides abstraction to what cloud drive you're dealing with. Providing similar functions for all of them.

Both [Folder](folder.md) and [File](file.md) are extensions of Item. Therefore, they both have these functions:

## Methods

### delete()
Delete this file or folder.

Parameters: None
Returns: Promise that resolves with undefined if operation was successfull.

### get_name()
Get the name of this file or folder.

Parameters: None
Returns: Promise that resolves with the name of the item.

### get_parent()
Get the parent folder of this file or folder or null if there isn't one.

Parameters: None
Returns: Promise that resolves with a Folder object.

### retrieve_info()
Retrieves info for this file or folder and adds that info to the object. This never has to be called by a user explicitly as the methods that require this info will call this on their own. That being said, if you want all your cloud server requests to happen at once instead of as needed, you should call this.

Parameters: None
Returns: Promise that resolves with undefined.
