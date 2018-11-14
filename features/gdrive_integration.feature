Feature: Google Drive Functions

    Background:
        Given I create a "GoogleDrive" integration
        And I connect to the demo google account

    Scenario: List files with page size of 1
        When I call the function "list_files" on the integration with parameters: "null,1"
        Then the length of "files" must be 1

    Scenario: List files without page size returns 10 files
        When I call the function "list_files" on the integration
        Then the length of "files" must be 10

    Scenario: List all files returns a list of all the 15 files
        When I call the function "list_all_files" on the integration
        Then the length of "files" must be 15

    Scenario: Upload a file
        When I call the function "upload_file" on the integration with parameters: "null,dummy_files/TestFile.txt"
        Then the result field: "name" should be: "TestFile.txt"
        And save the result field: "id" as "delete_id"
        And delete the file identified by the world key: "delete_id"

    Scenario: Upload a file to a folder
        When I call the function "upload_file" on the integration with parameters: "1k1XOAZfa-8UheF39kl2izExwBlzgkwT5,dummy_files/TestFile.txt"
        And save the result field: "id" as "params"
        And I call the function "get_file_info" on the integration with parameters saved as world key: "params"
        Then the length of "parents" must be 1
        And delete the file identified by the world key: "params"

    Scenario: Delete a file
        When I call the function "upload_file" on the integration with parameters: "null,dummy_files/TestFile.txt"
        And save the result field: "id" as "params"
        And I call the function "delete_file" on the integration with parameters saved as world key: "params"
        Then the result is undefined

    Scenario: Create a folder
        When I call the function "new_folder" on the integration with parameters: "undefined,Test Folder"
        And save the result field: "id" as "delete_id"
        And delete the folder identified by the world key: "delete_id"

    Scenario: Delete a folder
        When I call the function "new_folder" on the integration with parameters: "undefined,Test Folder"
        And save the result field: "id" as "params"
        And I call the function "delete_folder" on the integration with parameters saved as world key: "params"
        Then the result is undefined

    Scenario: Download a file
        When I call the function "download_file" on the integration with parameters: "1x7F7Y0v6tuNZrgzpp15gZhW8MUZhA8I-,test.png"
        Then the local file "test.png" exists
        And delete the local file "test.png"

    Scenario: Get all file info
        When I call the function "get_file_info" on the integration with parameters: "1x7F7Y0v6tuNZrgzpp15gZhW8MUZhA8I-"
        Then the result field: "name" should be: "Java_logo.png"
        And the result field: "md5Checksum" should be: "b7bfda87f22e4772f581e17bc533aa0c"

    Scenario: Get specific file info
        When I call the function "get_file_info" on the integration with parameters: "1x7F7Y0v6tuNZrgzpp15gZhW8MUZhA8I-,name"
        Then the result field: "name" should be: "Java_logo.png"
        And the result field: "md5Checksum" should be: "undefined"

    Scenario: Get all folder info
        When I call the function "get_folder_info" on the integration with parameters: "1k1XOAZfa-8UheF39kl2izExwBlzgkwT5"
        Then the result field: "name" should be: "Images"
        And the result field: "mimeType" should be: "application/vnd.google-apps.folder"

    Scenario: Get specific folder info
        When I call the function "get_folder_info" on the integration with parameters: "1k1XOAZfa-8UheF39kl2izExwBlzgkwT5, name"
        Then the result field: "name" should be: "Images"
        And the result field: "mimeType" should be: "undefined"      