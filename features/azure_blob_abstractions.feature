Feature: Azure Blob Abstractions

    Background:
        Given I create a "AzureBlob" integration
        And I connect to the demo azure blob account
        And I get a folder with id: "Root" and save it as: "root"

    Scenario: List files in root folder when empty
        When I call the function: "list_files" on saved object: "root"
        Then the length of the result must be: 0

    Scenario: Upload a file to the root folder and then list
        When I call the function: "upload_file" on saved object: "root" with parameters: "dummy_files/TestFile.txt"
        And I call the function: "list_files" on saved object: "root"
        Then the length of the result must be: 1
        And delete the file identified by: "TestFile.txt"

    Scenario: Creating directory without file (does nothing in Azure Blob)
        When I call the function: "new_folder" on saved object: "root" with parameters: "some_folder"
        And I get a folder with id: "/some_folder" and save it as: "some_folder"
        And I call the function: "list_files" on saved object: "root"
        Then the length of the result must be: 0
        And delete the folder identified by: "/some_folder"

    Scenario: Upload to subdirectory of subdirectory
        When I call the function: "new_folder" on saved object: "root" with parameters: "level_1"
        And I get a folder with id: "/level_1" and save it as: "level_1"
        And I call the function: "new_folder" on saved object: "level_1" with parameters: "level_2"
        And I get a folder with id: "/level_1/level_2" and save it as: "level_2"
        And I call the function: "upload_file" on saved object: "level_2" with parameters: "dummy_files/TestFile.txt"
        And I call the function: "upload_file" on saved object: "level_2" with parameters: "dummy_files/SecondTestFile.txt"
        And I call the function: "list_files" on saved object: "level_2"
        Then the length of the result must be: 2
        And delete the file identified by: "/level_1/level_2/TestFile.txt"
        And delete the file identified by: "/level_1/level_2/SecondTestFile.txt"
        And delete the folder identified by: "/level_1/level_2"
        And delete the folder identified by: "/level_1"

    Scenario: Recursive deletion of virtual folder
        When I call the function: "new_folder" on saved object: "root" with parameters: "level_1"
        And I get a folder with id: "/level_1" and save it as: "level_1"
        And I call the function: "new_folder" on saved object: "level_1" with parameters: "level_2"
        And I get a folder with id: "/level_1/level_2" and save it as: "level_2"
        And I call the function: "upload_file" on saved object: "level_2" with parameters: "dummy_files/TestFile.txt"
        And I call the function: "upload_file" on saved object: "level_2" with parameters: "dummy_files/SecondTestFile.txt"
        And I call the function: "list_files" on saved object: "level_2"
        Then the length of the result must be: 2
        And delete the folder identified by: "/level_1"
        And I call the function: "list_files" on saved object: "root"
        Then the length of the result must be: 0

    Scenario: Get name of root folder
        When I call the function: "get_name" on saved object: "root"
        Then the result should equal: "Root"

    Scenario: Download file
        When I call the function: "upload_file" on saved object: "root" with parameters: "dummy_files/TestFile.txt"
        And I get a file with id: "TestFile.txt" and save it as: "to_download"
        And I call the function: "download_to" on saved object: "to_download" with parameters: "test.txt"
        Then the local file "test.txt" exists
        And delete the local file "test.txt"
        And delete the file identified by: "TestFile.txt"

    Scenario: Upload file to a folder and check parents
        When I call the function: "new_folder" on saved object: "root" with parameters: "a"
        And I get a folder with id: "a" and save it as: "folder"
        And I call the function: "upload_file" on saved object: "folder" with parameters: "dummy_files/TestFile.txt"
        And I save the result as: "file"
        And I call the function: "get_parent" on saved object: "file"
        And I save the result as: "parent"
        And I call the function: "get_name" on saved object: "parent"
        Then the result should equal: "a"
        And I call the function: "get_parent" on saved object: "parent"
        And I save the result as: "test_root"
        And I call the function: "get_name" on saved object: "root"
        And the result should equal: "Root"
        And delete the file identified by: "a/TestFile.txt"
        And delete the folder identified by: "a"

    Scenario: Check checksum
        When I call the function: "upload_file" on saved object: "root" with parameters: "dummy_files/TestFile.txt"
        And I save the result as: "file"
        And I call the function: "get_checksum" on saved object: "file"
        Then the result should equal: "b10a8db164e0754105b7a99be72e3fe5"
        And delete the file identified by: "TestFile.txt"

    Scenario: Auto-Create folder paths
        When I get a folder with id: "subdir" and save it as: "subdir"
        And I call the function: "upload_file" on saved object: "subdir" with parameters: "dummy_files/TestFile.txt"
        And I save the result as: "testFile"
        And I call the function: "get_checksum" on saved object: "testFile"
        Then the result should equal: "b10a8db164e0754105b7a99be72e3fe5"
        And delete the file identified by: "subdir/TestFile.txt"
        And delete the folder identified by: "subdir"