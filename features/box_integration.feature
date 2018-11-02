Feature: Box Integration Functions

    Background:
        Given I create a "Box" integration
        And I connect to the demo box account

    Scenario: List files with page size of 1
        When I call the function "list_files" on the integration with parameters: "0,1,0"
        Then the entries must contain only the following:
        | type     | id          | etag | name         |
        | folder   | 41483367730 | 0    |  Music Test  |
    
    Scenario: List files without page size (defaults to 10)
        When I call the function "list_files" on the integration with parameters: "0"
        Then the entries must contain only the following:
        | type     | id           | etag | name         |
        | folder   | 41483367730  | 0    |  Music Test  |
        | file     | 246512849364 | 0    |  hanzo.png   |
        | file     | 246512853160 | 0    |  yeah.png    |

    Scenario: List all files
        When I call the function "list_all_files" on the integration with parameters: "0"
        Then the entries must contain only the following:
        | type     | id           | etag | name         |
        | folder   | 41483367730  | 0    |  Music Test  |
        | file     | 246512849364 | 0    |  hanzo.png   |
        | file     | 246512853160 | 0    |  yeah.png    |

    Scenario: Upload a file
        When I call the function "upload_file" on the integration with parameters: "0,dummy_files/TestFile.txt"
        Then index 0 of entries field: "name" should equal: "TestFile.txt"
        And save index 0 of entires field: "id" as "delete_id"
        And delete the file identified by the world key: "delete_id"

    Scenario: Delete a file
        When I call the function "upload_file" on the integration with parameters: "0,dummy_files/TestFile.txt"
        And save index 0 of entires field: "id" as "params"
        And I call the function "delete_file" on the integration with parameters saved as world key: "params"
        Then the result is undefined

    Scenario: Create a folder
        When I call the function "new_folder" on the integration with parameters: "0,Test Folder"
        Then the result field: "name" should be: "Test Folder"
        And save the result field: "id" as "delete_id"
        And delete the folder identified by the world key: "delete_id"

    Scenario: Delete a folder
        When I call the function "new_folder" on the integration with parameters: "0,Test Folder"
        And save the result field: "id" as "params"
        And I call the function "delete_folder" on the integration with parameters saved as world key: "params"
        Then the result is undefined