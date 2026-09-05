@regression
Feature: User Profile management

    @smoke @api @auth
    Scenario Outline: A user can successfully login and get an authorization token
        When the user login with "<username>" and "<password>"
        Then the system should return "<statusText>" and an authorization token if valid

        Examples:
            | username | password    | statusText |
            | admin    | password123 | OK         |
            | Long     | 2026        | OK         |
            | Eve      | Home        | OK         |

    @smoke @api 
    Scenario: A user can successfully create a booking
        Given a logged-in user session
        When they create a booking
            | firstname | lastname | totalprice | depositpaid | bookingdates                                        | additionalneeds |
            | Jane      | Doe      | 222        | true        | {"checkin": "2025-01-01", "checkout": "2026-01-01"} | Coffee          |
        Then the API should confirm the creation was successful

    @smoke @api
    Scenario: A user can get a booking's detail using its designated id
        Given an existing booking in the system
        When a user send a get request with the booking id
        Then the API should return that booking's details

    @smoke @api @wip
    Scenario: A user can successfully fully update their booking information
        Given a logged-in user session
        And an existing booking in the system
        When they fully update their booking details to:
            | firstname | lastname | totalprice | depositpaid | bookingdates                                        | additionalneeds |
            | Nina      | Jirachi  | 4562       | true        | {"checkin": "2027-01-01", "checkout": "2028-01-01"} | Ipod Touch      |
        Then the API should confirm the booking details were saved successfully

        # Second verification phase
        When a user send a get request with the booking id
        Then the API should return that booking's details

    @smoke @api @wip
    Scenario: A user can partially update their booking information
        Given a logged-in user session
        And an existing booking in the system
        When they partially update their booking details to:
            | firstname | totalprice | depositpaid |
            | Yorushika | 2020       | false       |
        Then the API should return the booking with partially updated details

        # Second verification phase
        When a user send a get request with the booking id
        Then the API should return that booking's details

    @smoke @api
    Scenario: A user can delete their booking
        Given a logged-in user session
        And an existing booking in the system
        When the user send a delete request with a booking's id
        Then the API should return a successful delete response

        # Second verification phase
        When a user send a get request with a booking id not available in the database 
        Then the API should NOT be able to return any booking with that id