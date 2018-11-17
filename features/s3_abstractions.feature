Feature: S3 File and Folder abstractions

    Background:
        Given I create a "S3" integration
        And I connect to the demo s3 account
        And I get a folder with id: "root" and save it as: "root"

    Scenario: List files in root folder
        When I call the function "upload_file" on the integration with parameters: "some_folder,dummy_files/TestFile.txt"
        And I call the function "upload_file" on the integration with parameters: "null,dummy_files/SecondTestFile.txt"
        And I call the function: "list_files" on saved object: "root"
        Then the length of the result must be: 2
        And delete the file identified by: "SecondTestFile.txt"
        And delete the file identified by: "some_folder/TestFile.txt"

    Scenario: List files in other folder
        When I call the function "upload_file" on the integration with parameters: "some_folder,dummy_files/TestFile.txt"
        And I call the function "upload_file" on the integration with parameters: "null,dummy_files/SecondTestFile.txt"
        And I get a folder with id: "some_folder" and save it as: "other"
        And I call the function: "list_files" on saved object: "other"
        Then the length of the result must be: 1
        And delete the file identified by: "SecondTestFile.txt"
        And delete the file identified by: "some_folder/TestFile.txt"

    Scenario: Get name of root folder
        When I call the function: "get_name" on saved object: "root"
        Then the result should equal: "Root"

    Scenario: Download file
        When I call the function "upload_file" on the integration with parameters: "some_folder,dummy_files/TestFile.txt"
        And I get a file with id: "some_folder/TestFile.txt" and save it as: "to_download"
        And I call the function: "download_to" on saved object: "to_download" with parameters: "test.txt"
        Then the local file "test.txt" exists
        And delete the local file "test.txt"
        And delete the file identified by: "some_folder/TestFile.txt"

    Scenario: Upload file to a folder and check parents
        When I get a folder with id: "a" and save it as: "folder"
        And I call the function: "upload_file" on saved object: "folder" with parameters: "dummy_files/TestFile.txt"
        And I save the result as: "file"
        And I call the function: "get_parent" on saved object: "file"
        And I save the result as: "parent"
        And I call the function: "get_name" on saved object: "parent"
        Then the result should equal: "a"
        And I call the function: "get_parent" on saved object: "parent"
        And I save the result as: "test_root"
        And I call the function: "get_name" on saved object: "test_root"
        And the result should equal: "Root"
        And delete the file identified by: "a/TestFile.txt"