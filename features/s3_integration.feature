Feature: Amazon S3 Functions

    Background:
        Given I create a "S3" integration
        And I connect to the demo s3 account

    Scenario: Upload a file
        When I call the function "upload_file" on the integration with parameters: "null,dummy_files/TestFile.txt"
        Then the result field: "key" should be: "TestFile.txt"
        And save the result field: "key" as "delete_id"
        And delete the file identified by the world key: "delete_id"