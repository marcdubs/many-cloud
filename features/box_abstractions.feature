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
