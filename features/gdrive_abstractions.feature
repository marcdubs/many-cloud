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