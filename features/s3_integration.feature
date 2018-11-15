Feature: Amazon S3 Functions

    Background:
        Given I create a "S3" integration
        And I connect to the demo s3 account

    Scenario: Upload a file
        When I call the function "upload_file" on the integration with parameters: "null,dummy_files/TestFile.txt"
        Then the result field: "key" should be: "TestFile.txt"
        And save the result field: "key" as "delete_id"
        And delete the file identified by the world key: "delete_id"

    Scenario: Download a file
        When I call the function "upload_file" on the integration with parameters: "null,dummy_files/TestFile.txt"
        And I call the function "download_file" on the integration with parameters: "TestFile.txt,test.txt"
        Then the result is undefined
        And the local file "test.txt" exists
        And delete the local file "test.txt"
        And delete the file identified by: "TestFile.txt"

    Scenario: List files
        When I call the function "upload_file" on the integration with parameters: "null,dummy_files/TestFile.txt"
        And I call the function "list_files" on the integration
        Then the length of "Contents" must be 1
        And delete the file identified by: "TestFile.txt"

    Scenario: List files in "folder"
        When I call the function "upload_file" on the integration with parameters: "some_folder,dummy_files/TestFile.txt"
        And I call the function "list_files" on the integration
        Then the length of "Contents" must be 0
        And the length of "CommonPrefixes" must be 1
        And I call the function "list_files" on the integration with parameters: "some_folder"
        And the length of "Contents" must be 1
        And the length of "CommonPrefixes" must be 0
        And delete the file identified by: "some_folder/TestFile.txt"