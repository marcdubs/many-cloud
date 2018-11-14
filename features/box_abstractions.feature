Feature: Box File and Folder abstractions

    Background:
        Given I create a "Box" integration
        And I connect to the demo box account
        And I get a folder with id: "root" and save it as: "root"

    Scenario: List files in root folder
        When I call the function: "list_files" on saved object: "root"
        Then the length of the result must be: 3

    Scenario: List files in other folder
        When I get a folder with id: "41483367730" and save it as: "other"
        And I call the function: "list_files" on saved object: "other"
        Then the length of the result must be: 4

    Scenario: Get name of root folder
        When I call the function: "get_name" on saved object: "root"
        Then the result should equal: "All Files"

    Scenario: Get name of other folder
        When I get a folder with id: "41483367730" and save it as: "other"
        And I call the function: "get_name" on saved object: "other"
        Then the result should equal: "Music Test"

    Scenario: Get parent of other folder
        When I get a folder with id: "41483367730" and save it as: "other"
        And I call the function: "get_parent" on saved object: "other"
        Then the result field: "name" should be: "All Files"
        And the result field: "id" should be: "0"

    Scenario: Get parent of root folder
        When I call the function: "get_parent" on saved object: "root"
        Then the result is null

    Scenario: Download file
        When I get a file with id: "246512849364" and save it as: "to_download"
        And I call the function: "download_to" on saved object: "to_download" with parameters: "hanzo.png"
        Then the local file "hanzo.png" exists
        And delete the local file "hanzo.png"

    Scenario: Get name of file
        When I get a file with id: "246512849364" and save it as: "other"
        And I call the function: "get_name" on saved object: "other"
        Then the result should equal: "hanzo.png"

    Scenario: Get parent of file
        When I get a file with id: "246512849364" and save it as: "other"
        And I call the function: "get_parent" on saved object: "other"
        And I save the result as: "parent"
        And I call the function: "get_name" on saved object: "parent"
        Then the result should equal: "All Files"

    Scenario: Upload file to folder
        When I get a folder with id: "41483367730" and save it as: "folder"
        And I call the function: "upload_file" on saved object: "folder" with parameters: "dummy_files/TestFile.txt"
        And save the result field: "id" as "delete_id"
        And I save the result as: "file"
        And I call the function: "get_parent" on saved object: "file"
        And I save the result as: "parent"
        And I call the function: "get_name" on saved object: "parent"
        Then the result should equal: "Music Test"
        And delete the file identified by the world key: "delete_id"

    Scenario: Create folder
        When I get a folder with id: "root" and save it as: "root"
        And I call the function: "new_folder" on saved object: "root" with parameters: "New Test Folder"
        And I save the result as: "folder"
        And save the result field: "id" as "delete_id"
        And I call the function: "get_name" on saved object: "folder"
        Then the result should equal: "New Test Folder"
        And delete the folder identified by the world key: "delete_id"

    Scenario: Delete a file
        When I get a folder with id: "root" and save it as: "folder"
        And I call the function: "upload_file" on saved object: "folder" with parameters: "dummy_files/TestFile.txt"
        And I save the result as: "file"
        And I call the function: "delete" on saved object: "file"
        Then the result is undefined
        
    Scenario: Delete a folder
        When I get a folder with id: "root" and save it as: "root"
        And I call the function: "new_folder" on saved object: "root" with parameters: "New Test Folder"
        And I save the result as: "folder"
        And I call the function: "delete" on saved object: "folder"
        Then the result is undefined

    Scenario: Checksum
        When I get a file with id: "246512849364" and save it as: "file"
        And I call the function: "get_checksum" on saved object: "file"
        Then the result should equal: "7bfe75ea785583e910222e5480950a811ea778ce"