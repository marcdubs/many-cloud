Feature: Google Drive Functions

    Background:
        Given I create a "GoogleDrive" integration
        And I connect to the demo google account

    Scenario: List files with page size of 1
        When I call the function "list_files" on the integration with parameters: "1"
        Then the length of "files" must be 1

    Scenario: List files without page size returns 10 files
        When I call the function "list_files" on the integration
        Then the length of "files" must be 10

    Scenario: List all files returns a list of all the 15 files
        When I call the function "list_all_files" on the integration
        Then the length of "files" must be 15

    Scenario: Upload a file
        When I call the function "upload_file" on the integration with parameters: "dummy_files/TestFile.txt"
        Then the result field: "name" should be: "TestFile.txt"
        And save the result field: "id" as "delete_id"
        And delete the file identified by the world key: "delete_id"

    Scenario: Delete a file
        When I call the function "upload_file" on the integration with parameters: "dummy_files/TestFile.txt"
        And save the result field: "id" as "params"
        And I call the function "delete_file" on the integration with parameters saved as world key: "params"
        Then the result is undefined