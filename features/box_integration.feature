Feature: List Files

    Calls the list_files function to list a specific number of files

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

    Scenario: list all files
        When I call the function "list_all_files" on the integration with parameters: "0"
        Then the entries must contain only the following:
        | type     | id           | etag | name         |
        | folder   | 41483367730  | 0    |  Music Test  |
        | file     | 246512849364 | 0    |  hanzo.png   |
        | file     | 246512853160 | 0    |  yeah.png    |