Feature: Box File and Folder abstractions

    Background:
        Given I create a "GoogleDrive" integration
        And I connect to the demo google account
        And I get a folder with id: "root" and save it as: "root"

    Scenario: List files in root folder
        When I call the function: "list_files" on saved object: "root"
        Then the length of the result must be: 3

    Scenario: List files in other folder
        When I get a folder with id: "1KzP53T2FlYz9jfIiBzp4PH0vel4XZvOA" and save it as: "other"
        And I call the function: "list_files" on saved object: "other"
        Then the length of the result must be: 2

    Scenario: Get name of root folder
        When I call the function: "get_name" on saved object: "root"
        Then the result should equal: "My Drive"

    Scenario: Get name of other folder
        When I get a folder with id: "1KzP53T2FlYz9jfIiBzp4PH0vel4XZvOA" and save it as: "other"
        And I call the function: "get_name" on saved object: "other"
        Then the result should equal: "Text Files"

    Scenario: Get parent of other folder
        When I get a folder with id: "1KzP53T2FlYz9jfIiBzp4PH0vel4XZvOA" and save it as: "other"
        And I call the function: "get_parent" on saved object: "other"
        And I save the result as: "parent"
        And I call the function: "get_name" on saved object: "parent"
        Then the result should equal: "My Drive"

    Scenario: Get parent of root folder
        When I call the function: "get_parent" on saved object: "root"
        Then the result is null

    Scenario: Download file
        When I get a file with id: "1RpxzKzzjDH57n3Vs-RroFf-U_dT_gPtW" and save it as: "to_download"
        And I call the function: "download_to" on saved object: "to_download" with parameters: "test.txt"
        Then the local file "test.txt" exists
        And delete the local file "test.txt"

    Scenario: Get name of file
        When I get a file with id: "1RpxzKzzjDH57n3Vs-RroFf-U_dT_gPtW" and save it as: "other"
        And I call the function: "get_name" on saved object: "other"
        Then the result should equal: "Lorem.txt"

    Scenario: Get parent of file
        When I get a file with id: "1RpxzKzzjDH57n3Vs-RroFf-U_dT_gPtW" and save it as: "other"
        And I call the function: "get_parent" on saved object: "other"
        And I save the result as: "parent"
        And I call the function: "get_name" on saved object: "parent"
        Then the result should equal: "Text Files"

    Scenario: Upload file to a folder
        When I get a folder with id: "1KzP53T2FlYz9jfIiBzp4PH0vel4XZvOA" and save it as: "folder"
        And I call the function: "upload_file" on saved object: "folder" with parameters: "dummy_files/TestFile.txt"
        And save the result field: "id" as "delete_id"
        And I save the result as: "file"
        And I call the function: "get_parent" on saved object: "file"
        And I save the result as: "parent"
        And I call the function: "get_name" on saved object: "parent"
        Then the result should equal: "Text Files"
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